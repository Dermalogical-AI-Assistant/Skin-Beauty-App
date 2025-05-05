import { AcneDetection, SkinAnalysisResult } from "../../hooks/useSkinAnalysis";

export const AnalysisSummary = (skinAnalysis: SkinAnalysisResult) => {
  const acneDetections = skinAnalysis.acneDetection?.predicts || [];
  const groupedAcneDetections = Object.values(
    acneDetections.reduce(
      (acc: Record<string, AcneDetection[]>, acnePrediction) => {
        acc[acnePrediction.name] = acc[acnePrediction.name] || [];
        acc[acnePrediction.name].push(acnePrediction);
        return acc;
      },
      {},
    ),
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-[#F3BBA5]">
        General Skin Overview
      </h2>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Acne Detection</strong>
        </p>
        <p>
          Total acne spots detected: <strong>{acneDetections?.length}</strong>
        </p>

        <p className="mt-2">
          <strong>Types of Acne:</strong>
        </p>
        <ul className="ml-6 list-disc">
          {groupedAcneDetections.map((group, index) => (
            <li key={index}>
              {group[0].name}:{" "}
              <span className="text-orange-600">{group.length}</span>
            </li>
          ))}
        </ul>
        {/* <ul className="ml-6 list-disc">
          <li>
            Blackheads: <span className="text-orange-600">3</span>
          </li>
          <li>
            Inflammatory acne: <span className="text-red-500">2</span>
          </li>
          <li>
            Pustules: <span className="text-green-600">1</span>
          </li>
          <li>
            Clogged pores (hidden acne):{" "}
            <span className="text-purple-500">1</span>
          </li>
        </ul> */}

        <p className="mt-4">
          <strong>Acne Severity</strong>
        </p>
        <p>
          Level: <span className="font-medium">{skinAnalysis.acneSeverity?.predicts[0].name}</span>
        </p>
        <p>
          Confidence score: <em>{skinAnalysis.acneSeverity?.predicts[0].confidence}</em>
        </p>
      </div>
    </div>
  );
};
