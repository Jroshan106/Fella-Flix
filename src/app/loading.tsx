export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="box"></div>
      <style>{`
        .box {
          height: 5cm;
          width: 5cm;
          border: 5px solid #394d3e;
          box-shadow: inset 0 0 0 #8fba96;
          animation: load 2s ease-in-out infinite;
        }

        @keyframes load {
          0% {
            box-shadow: inset -2.5cm -2.5cm 0 #8fba96;
          }
          25% {
            box-shadow: inset 2.5cm -2.5cm 0 #394d3e;
          }
          50% {
            box-shadow: inset 2.5cm 2.5cm 0 #8fba96;
          }
          75% {
            box-shadow: inset -2.5cm 2.5cm 0 #394d3e;
          }
          100% {
            box-shadow: inset -2.5cm -2.5cm 0 #8fba96;
          }
        }
      `}</style>
    </div>
  );
}
