export default function DotPulsePreloader({ color }) {
  return (
    <div className="relative">
        <div className={`dot-pulse relative left-[-9999px] w-2.5 h-2.5 rounded-full text-[${color}] animate-dot-pulse`}>
            <div className={`absolute top-0 left-0 w-2.5 h-2.5 rounded-full text-[${color}] animate-dot-pulse-before`}></div>
            <div className={`absolute top-0 left-0 w-2.5 h-2.5 rounded-full text-[${color}] animate-dot-pulse-after`}></div>
        </div>
    </div>
  );
}
