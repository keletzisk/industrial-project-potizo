import { STANDARD_ZOOM } from "util/constants";

export const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  return {
    useNavigate: () => mockUseNavigate,
  };
});

export function expectMockNavigate(url, latitude, longitude) {
  expect(mockUseNavigate.mock.calls).toHaveLength(1);
  expect(mockUseNavigate.mock.calls[0][0]).toEqual(url);
  expect(mockUseNavigate.mock.calls[0][1]).toMatchObject({
    state: {
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
      zoom: STANDARD_ZOOM,
    },
  });
}
