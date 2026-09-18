import model from "./ml-model.json";

export default function handler(req: any, res: any) {
  try {
    const q = req.query;

    const features = [
      Number(q.duration ?? 35),
      Number(q.cost ?? 80),
      Number(q.walking ?? 10),
      Number(q.transfers ?? 1),
      q.connectivity === "Normal"
        ? 1
        : q.connectivity === "Unstable"
        ? 0.7
        : 0.3,
      Number(q.battery ?? 50),
      Number(q.helpPoints ?? 2),
      Number(q.rain ?? 2),
      Number(q.windSpeed ?? 20),
      Number(q.priorityMatch ?? 0.5)
    ];

    const normalized = features.map(
      (value, i) =>
        (value - model.mean[i]) /
        (model.scale[i] || 1)
    );

    let z = model.intercept;

    for (let i = 0; i < normalized.length; i++) {
      z += normalized[i] * model.weights[i];
    }

    const probability =
      1 / (1 + Math.exp(-z));

    const score = Math.max(
      0,
      Math.min(1, probability)
    );

    const recommendation =
      score >= 0.75
        ? "Strong contextual fit"
        : score >= 0.55
        ? "Reasonable contextual fit"
        : "Consider another available option";

    return res.status(200).json({
      success: true,
      model: model.version,
      modelType: "Logistic Regression",
      trained: true,
      suitabilityScore: Number(score.toFixed(3)),
      recommendation,
      features
    });

  } catch (error) {
    console.error(
      "ML route suitability error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "ML prediction failed"
    });
  }
}
