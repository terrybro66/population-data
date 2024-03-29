export const geodata = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "London",
        h: 1000,
        color: [255, 0, 0, 100],
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-0.1198637735233774, 51.55316346173021],
            [-0.12554173508629335, 51.55298988226802],
            [-0.13116488587580877, 51.55247081949832],
            [-0.1366789479446293, 51.55161128398239],
            [-0.1420307036740502, 51.55041957252001],
            [-0.1471685126879628, 51.548907187514146],
            [-0.15204281303019795, 51.547088725210585],
            [-0.15660660162989073, 51.54498173392763],
            [-0.16081588930610277, 51.54260654368682],
            [-0.16463012583992698, 51.539986068939264],
            [-0.1680125909657993, 51.537145586343996],
            [-0.17093074749925147, 51.53411248979854],
            [-0.17335655322087512, 51.530916025140016],
            [-0.1752667285704772, 51.5275870071289],
            [-0.17664297766566836, 51.5241575214934],
            [-0.1774721606396695, 51.52066061494958],
            [-0.17774641578812864, 51.517129976220076],
            [-0.1774632305184532, 51.51359961115076],
            [-0.1766254606019656, 51.510103515070895],
            [-0.1752412977337066, 51.506675345557554],
            [-0.17332418590185145, 51.50334809874912],
            [-0.17089268755374926, 51.50015379230762],
            [-0.16797030101419935, 51.49712315805463],
            [-0.16458523105983702, 51.4942853472029],
            [-0.16077011497792396, 51.49166765097644],
            [-0.15656170683538437, 51.489295239257316],
            [-0.15200052305196007, 51.48719091971955],
            [-0.14713045270765646, 51.485374919710964],
            [-0.14199833631735484, 51.483864692925046],
            [-0.13665351707305456, 51.48267475266829],
            [-0.13114736878546812, 51.48181653327699],
            [-0.12553280495066071, 51.48129828097292],
            [-0.1198637735233774, 51.48112497517149],
            [-0.1141947420960941, 51.48129828097292],
            [-0.1085801782612867, 51.48181653327699],
            [-0.10307402997370024, 51.48267475266829],
            [-0.09772921072940001, 51.483864692925046],
            [-0.09259709433909835, 51.485374919710964],
            [-0.08772702399479472, 51.48719091971955],
            [-0.0831658402113704, 51.489295239257316],
            [-0.07895743206883084, 51.49166765097644],
            [-0.07514231598691778, 51.4942853472029],
            [-0.07175724603255547, 51.49712315805463],
            [-0.06883485949300554, 51.50015379230762],
            [-0.06640336114490333, 51.50334809874912],
            [-0.06448624931304817, 51.506675345557554],
            [-0.06310208644478917, 51.510103515070895],
            [-0.06226431652830161, 51.51359961115076],
            [-0.061981131258626164, 51.517129976220076],
            [-0.0622553864070853, 51.52066061494958],
            [-0.06308456938108643, 51.5241575214934],
            [-0.06446081847627758, 51.5275870071289],
            [-0.06637099382587966, 51.530916025140016],
            [-0.06879679954750333, 51.53411248979854],
            [-0.07171495608095547, 51.537145586343996],
            [-0.0750974212068278, 51.539986068939264],
            [-0.07891165774065198, 51.54260654368682],
            [-0.08312094541686402, 51.54498173392763],
            [-0.08768473401655684, 51.547088725210585],
            [-0.09255903435879197, 51.548907187514146],
            [-0.09769684337270458, 51.55041957252001],
            [-0.10304859910212545, 51.55161128398239],
            [-0.10856266117094598, 51.55247081949832],
            [-0.11418581196046143, 51.55298988226802],
            [-0.1198637735233774, 51.55316346173021],
          ],
        ],
      },
    },
  ],
};

export const schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    features: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          properties: {
            type: "object",
            properties: {
              name: { type: "string" },
              height: { type: "number" },
              color: {
                type: "array",
                items: { type: "number" },
                minItems: 3,
                maxItems: 3,
              },
            },
            required: ["name", "height", "color"],
          },
          geometry: {
            type: "object",
            properties: {
              type: { type: "string" },
              coordinates: {
                type: "array",
                items: {
                  type: "array",
                  items: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2,
                  },
                },
              },
            },
            required: ["type", "coordinates"],
          },
        },
        required: ["type", "properties", "geometry"],
      },
    },
  },
  required: ["type", "features"],
};

export const locations = {
  london: {
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 9,
    pitch: 45,
    bearing: 0,
  },
  paris: {
    longitude: 2.3522,
    latitude: 48.58572,
    zoom: 10,
    pitch: 45,
    bearing: 0,
  },
};
