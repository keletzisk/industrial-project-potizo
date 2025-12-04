import TreeItem from "../TreeItem/TreeItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@chakra-ui/layout";
import { AdoptTreeCard } from "components/Trees/AdoptTreeCard/AdoptTreeCard";
import { MAX_ADOPTION_TREES } from "util/constants";

export function TreeCardSlider({ trees, setLoadedTrees }) {
  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 3,
    swipeToSlide: true,
    swipe: true,
    appendDots: (dots) => (
      <Box pos="absolute" height="0" top="0" bottom="initial">
        <ul> {dots} </ul>
      </Box>
    ),
    responsive: [
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box px={8} pt={2} overflow="hidden" flex="1" alignSelf="stretch">
      <Slider style={{ paddingTop: "2rem" }} {...settings}>
        {trees.map((tree) => {
          return (
            <div key={tree.id}>
              <TreeItem
                key={tree.id} // TODO: not used?
                tree={tree}
                setLoadedTrees={setLoadedTrees}
              />
            </div>
          );
        })}
        {trees.length < MAX_ADOPTION_TREES && (
          <Box height="250px">
            <AdoptTreeCard />
          </Box>
        )}
      </Slider>
    </Box>
  );
}
