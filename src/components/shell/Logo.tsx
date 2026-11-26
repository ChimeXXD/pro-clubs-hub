import Image from "next/image";

// Figma Logo/Lockup (133:17): the mark and the wordmark, in the "On dark" or "On light" colours (Logo collection).
// The files are two-coloured, so each theme has its own and CSS shows one. Sizes are the design's:
// header 22 px tall on phone and 26 px from tablet (Top bar 205:407); footer 18 px (Footer notice 205:434); share
// cards 14 px (316:888).
const SIZES = {
  header: {
    gap: "gap-[5.5px] tablet:gap-[6.5px]",
    mark: "h-[22px] w-[22.9167px] tablet:h-[26px] tablet:w-[27.0833px]",
    word: "h-[14.1604px] w-[100.708px] tablet:h-[16.7351px] tablet:w-[119.019px]",
  },
  footer: { gap: "gap-[4.5px]", mark: "h-[18px] w-[18.75px]", word: "h-[11.5858px] w-[82.3977px]" },
  // The share cards' corner (316:888): 14 px tall, 82 px wide.
  card: { gap: "gap-[3.5px]", mark: "h-[14px] w-[14.5833px]", word: "h-[9.0115px] w-[64.0871px]" },
} as const;

function Part({ part, className }: { part: "mark" | "wordmark"; className: string }) {
  const [w, h] = part === "mark" ? [27.0833, 26] : [119.019, 16.7351];
  return (
    <>
      <Image src={`/brand/logo-${part}-on-dark.svg`} alt="" width={w} height={h} className={`${className} light:hidden`} />
      <Image src={`/brand/logo-${part}-on-light.svg`} alt="" width={w} height={h} className={`${className} hidden light:block`} />
    </>
  );
}

export function Logo({ size }: { size: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <span className={`flex items-center ${s.gap}`}>
      <Part part="mark" className={s.mark} />
      <Part part="wordmark" className={s.word} />
    </span>
  );
}
