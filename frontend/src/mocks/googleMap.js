import createGoogleMapsMock from "jest-google-maps-mock";

import "../components/Map/useGoogleMap";

const { Map: GoogleMap } = createGoogleMapsMock();
const mockGoogleMap = new GoogleMap(document.getElementById("google-map"));

jest.mock("../components/Map/useGoogleMap", () => {
  return {
    useGoogleMap: () => mockGoogleMap,
  };
});

export function getSetCenterMock(message) {
  return mockGoogleMap.setCenter.mock;
}
