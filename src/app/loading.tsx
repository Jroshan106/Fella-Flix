export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
      <style>{`
        .loader {
          position: absolute;
          top: calc(50% - 32px);
          left: calc(50% - 32px);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          perspective: 800px;
        }

        .inner {
          position: absolute;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 50%;  
        }

        .inner.one {
          left: 0%;
          top: 0%;
          animation: rotate-one 1s linear infinite;
          border-bottom: 3px solid #8fba96;
        }

        .inner.two {
          right: 0%;
          top: 0%;
          animation: rotate-two 1s linear infinite;
          border-right: 3px solid #394d3e;
        }

        .inner.three {
          right: 0%;
          bottom: 0%;
          animation: rotate-three 1s linear infinite;
          border-top: 3px solid #8fba96;
        }

        @keyframes rotate-one {
          0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
        }

        @keyframes rotate-two {
          0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
          100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
        }

        @keyframes rotate-three {
          0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}
