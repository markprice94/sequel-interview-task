import * as functions from "firebase-functions";

export const getWeather = functions.https.onRequest(
  async (request, response) => {
    const {latitude, longitude} = request.query;

    try {
      const apiResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${
          latitude || 51.51
        }&longitude=${
          longitude || -0.13
        }&hourly=temperature_2m&current_weather=true`
      );
      const data = await apiResponse.json();
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.status(200).send(data);
    } catch (error) {
      response.status(500).send({error: "Failed to fetch weather data"});
    }
  }
);
