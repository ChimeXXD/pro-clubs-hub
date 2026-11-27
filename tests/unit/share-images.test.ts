import { describe, expect, it } from "vitest";
import { CARD, PIXEL_RATIO, restoreFontSizes, SAVE_TOAST, saveMode, saveState, shareImageNames, STORY, styleProperties } from "@/lib/share-images";

// "Save images" (D-64 (2), D-111): the two story cards as 1080 × 1920 PNGs, named from the build's slug, handed to
// the phone's share sheet where it takes files, downloaded otherwise.
describe("share images", () => {
  it("draws Figma's 360 × 640 card (316:888, 316:973) at the 1080 × 1920 story size, the same card scaled", () => {
    expect(CARD).toEqual({ width: 360, height: 640 });
    expect(STORY).toEqual({ width: 1080, height: 1920 });
    expect(PIXEL_RATIO).toBe(3);
    expect([CARD.width * PIXEL_RATIO, CARD.height * PIXEL_RATIO]).toEqual([STORY.width, STORY.height]);
  });

  it("words the Save images toasts as Figma draws them (493:9624 to 493:15977, D-114 (2))", () => {
    expect(SAVE_TOAST.saving).toEqual({ tone: "info", icon: "download", message: "Making your images…" });
    expect(SAVE_TOAST.photos).toEqual({ tone: "success", icon: "check-circle", message: "Both cards saved to your photos." });
    expect(SAVE_TOAST.downloads).toEqual({ tone: "success", icon: "check-circle", message: "Both cards saved to your downloads." });
    expect(SAVE_TOAST.failed).toEqual({ tone: "danger", icon: "error", message: "Couldn't save the images. Try again." });
    // Handed to the share sheet (a phone or iPad: Photos), downloaded (desktop), or the share sheet closed: no toast.
    expect(saveState("shared")).toBe("photos");
    expect(saveState("downloaded")).toBe("downloads");
    expect(saveState("cancelled")).toBeNull();
  });

  it("names the two files from the build's slug", () => {
    expect(shareImageNames("meta-finisher")).toEqual(["meta-finisher-1.png", "meta-finisher-2.png"]);
    expect(shareImageNames("spark-2008-winger")).toEqual(["spark-2008-winger-1.png", "spark-2008-winger-2.png"]);
  });

  describe("share or download", () => {
    const files = [new File(["x"], "a-1.png", { type: "image/png" })];
    const share = async () => {};

    it("shares when the device can share these files", () => {
      expect(saveMode({ canShare: () => true, share }, files)).toBe("share");
    });

    it("downloads when it can't share files, has no canShare or no share, or canShare throws", () => {
      expect(saveMode({ canShare: () => false, share }, files)).toBe("download");
      expect(saveMode({ share }, files)).toBe("download");
      expect(saveMode({ canShare: () => true }, files)).toBe("download");
      expect(
        saveMode(
          {
            canShare: () => {
              throw new TypeError("no files");
            },
            share,
          },
          files,
        ),
      ).toBe("download");
      expect(saveMode(undefined, files)).toBe("download");
    });

    it("asks canShare about the files themselves", () => {
      let asked: ShareData | undefined;
      saveMode(
        {
          canShare: (data) => {
            asked = data;
            return true;
          },
          share,
        },
        files,
      );
      expect(asked).toEqual({ files });
    });
  });

  describe("html-to-image 1.11.13 work-arounds", () => {
    const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    it("puts back the font sizes html-to-image cuts to floor(size) − 0.1 px, so lines are as long as on screen", () => {
      const cut = svgUrl('<p style="font-size: 12.9px; color: red;">13</p><b style="font-size: 33.9px;">34</b>');
      expect(decodeURIComponent(restoreFontSizes(cut).split(",")[1] ?? "")).toBe(
        '<p style="font-size: 13px; color: red;">13</p><b style="font-size: 34px;">34</b>',
      );
    });

    it("also inside Chromium's font shorthand, where the size is the first length and the line height stays", () => {
      const cut = svgUrl('<p style="color: red; font: 600 12.9px / 18.9px Barlow, &quot;Barlow Fallback&quot;; margin: 0px;">x</p>');
      expect(decodeURIComponent(restoreFontSizes(cut).split(",")[1] ?? "")).toBe(
        '<p style="color: red; font: 600 13px / 18.9px Barlow, &quot;Barlow Fallback&quot;; margin: 0px;">x</p>',
      );
    });

    it("leaves other sizes, text and the data URL's head alone", () => {
      const svg = '<p style="font-size: 13px; line-height: 18.9px; font-family: Barlow; font-feature-settings: normal;">font-size: 12.9px, 100%</p>';
      expect(restoreFontSizes(svgUrl(svg))).toBe(svgUrl(svg));
    });

    it("copies every computed property except the corner shapes, which make WebKit drop the rounded corners", () => {
      const names = ["display", "border-top-left-radius", "border-start-start-radius", "corner-top-left-shape", "corner-start-end-shape", "color"];
      expect(styleProperties(names)).toEqual(["display", "border-top-left-radius", "border-start-start-radius", "color"]);
    });
  });
});
