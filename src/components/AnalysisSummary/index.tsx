import { SkinAnalysisResult } from "../../hooks/useSkinAnalysis";
import { useEffect } from "react";
import { rgbToHex } from "../../utils/color.ts";

export const AnalysisSummary = (skinAnalysis: SkinAnalysisResult) => {

  const counts: { [key: string]: { count: number; hex: string } } = {};

  skinAnalysis.acneDetection?.predicts?.forEach(({ name, color }) => {
    const hex = rgbToHex(color[0], color[1], color[2]);
    counts[name] = counts[name]
      ? { count: counts[name].count + 1, hex }
      : { count: 1, hex };
  });

  useEffect(
    () => {
      console.log("hahahhaha",skinAnalysis);
    },
    [skinAnalysis]
  )

  return (
    <div>
      <h2 className="from-pink-light to-pink-light/50 mb-4 bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent drop-shadow-2xl lg:text-4xl text-center">
        General Skin Overview
      </h2>

      <div className="flex flex-col gap-5">
        {/*Acne Detection*/}
        <div>
          <p className={`text-xl drop-shadow-lg font-semibold`}>Acne Detection</p>
          <div className={`border-l-4 border-primary-dark/80 pl-3 ml-1`}>
            <p className={`font-bold`}>
              Total acne spots detected: <span className={`font-medium`}>{skinAnalysis.acneDetection?.predicts?.length}</span>
            </p>
            <div>
              <p className="">
                <strong>Types of Acne:</strong>
              </p>
              <ul className="ml-3 list-disc list-inside grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(counts).map(([name, { count, hex }]) => (
                  <div
                    key={name}
                    className={`py-2 text-stroke`}
                  >
                  <span
                    style={{ color: hex }}
                    className={`drop-shadow-2xl bg-sky-950 text-stroke   font-semibold p-2 rounded-full`}
                  >{name}</span>

                    <span className={`ml-2 p-2 rounded-full drop-shadow-lg bg-white/60 font-semibold`}>
                  {count}
                  </span>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*Acne Severity*/}
        <div>
          <p className="text-lg font-semibold  drop-shadow-lg">
            <strong>Acne Severity</strong>
          </p>
        <div className={`border-l-4 border-primary-dark/80 pl-3 ml-1`}>
           <p className={`font-bold`}>
             Level: <span className="font-medium">{skinAnalysis?.acneSeverity[0]?.predicts[0]?.name}</span>
           </p>
         </div>
        </div>

        {/*Skin Type*/}
        <div>
          <p className="text-lg font-semibold drop-shadow-lg">
            <strong>Skin Type</strong>
          </p>
          <div className={`border-l-4 border-primary-dark/80 pl-3 ml-1`}>
            <p className={`font-bold`}>
              Type: <span className="font-medium">{skinAnalysis?.skinType?.predicts.name}</span>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};
