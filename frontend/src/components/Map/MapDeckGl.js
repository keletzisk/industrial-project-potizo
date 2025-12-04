import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { AuthContext } from "../../context/auth-context";
import { greekLabels } from "../../util/language";
import { useGoogleMap } from "./useGoogleMap";
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Progress,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zipCodeSearch } from "services/api";

import {
  getCombinedUserTreeDataFromLSorAPI,
  orderedTreeData,
} from "components/Map/mapService";

import { AdoptModal } from "components/Map/AdoptModal";
import { MyTreeModal } from "components/Map/MyTreeModal";
import { SearchZipModal } from "components/Map/SearchZipModal";
import { TutorialModal } from "components/Map/TutorialModal";
import { TbFocus2 } from "react-icons/tb";
import { BiSearch } from "react-icons/bi";
import { TiInfoLarge } from "react-icons/ti";
import { ReactComponent as TreeIcon } from "assets/icons/tree-white.svg";
import { toastError, toastSuccess } from "util/helpers";
import {
  NEW_TREES_CREATED_DATE,
  STANDARD_ZOOM,
  adoptedTreeColor,
  newTreeColor,
  oldTreeColor,
  yourTreeColor,
} from "util/constants";
import iconAtlas from "../../assets/icons/treesAtlas.png";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const isNewTree = (date) => new Date(date).getTime() >= NEW_TREES_CREATED_DATE;

export function MapDeckGl() {
  /** @type google.maps.Map */
  const googleMap = useGoogleMap();

  const auth = useContext(AuthContext);
  const { state: locationState } = useLocation();
  const [currentZoom, setCurrentZoom] = useState();
  const [deckOverlay, setDeckOverlay] = useState();

  const [zip, setZip] = useState("");
  const [idOfTree, setIdOfTree] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [treeIndexToFocus, setTreeIndexToFocus] = useState(0);

  const {
    isOpen: isAdoptOpen,
    onOpen: onAdoptOpen,
    onClose: onAdoptClose,
  } = useDisclosure();
  const {
    isOpen: isMyTreeOpen,
    onOpen: onMyTreeOpen,
    onClose: onMyTreeClose,
  } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const {
    isOpen: isTutorialOpen,
    onOpen: onTutorialOpen,
    onClose: onTutorialClose,
  } = useDisclosure();
  const toast = useToast();


  const atlas = { tree1 : { x: 0, y: 0, width: 64, height: 64 },
                  tree2 : { x: 64, y: 0, width: 64, height: 64 },
                  tree3 : { x: 128, y: 0, width: 64, height: 64 },
                  yourTree1 : { x: 0, y: 64, width: 64, height: 64 },
                  yourTree2 : { x: 64, y: 64, width: 64, height: 64 },
                  yourTree3 : { x: 128, y: 64, width: 64, height: 64 },
                  adoptedTree1 : { x: 0, y: 128, width: 64, height: 64 },
                  adoptedTree2 : { x: 64, y: 128, width: 64, height: 64 },
                  adoptedTree3 : { x: 128, y: 128, width: 64, height: 64 },
                  oldTree1 : { x: 0, y: 192, width: 64, height: 64 },
                  adoptedTree4 : { x: 64, y: 192, width: 64, height: 64 },
                  oldTree3 : { x: 128, y: 192, width: 64, height: 64 },
                };

  const [tooltip, setTooltip] = useState('');
  const [treeData, setTreeData] = useState(null);

  // executed only once due to [] dependencies
  useEffect(() => {
    setDeckOverlay(new GoogleMapsOverlay());
  }, []);

  useEffect(() => {
    async function getTrees() {
      const combinedData = await getCombinedUserTreeDataFromLSorAPI(
        auth,
        toast
      );
      setSourceData(combinedData);
    }

    getTrees();
  }, [auth, toast]); // both recommended dependencies are constants

  useEffect(() => {
    if (!googleMap) return;

    googleMap.zoom_changed = () => {
      setCurrentZoom(googleMap.getZoom());
    };

    setCurrentZoom(googleMap.getZoom());
  }, [googleMap]);

  useEffect(() => {
    if (!googleMap || !locationState) return;

    googleMap.setCenter(locationState.coordinates);
    googleMap.setZoom(locationState.zoom);
  }, [googleMap, locationState]);

  /**
   * necessary to have sourceData as a dependency
   * since focus functionality depends on userTreeData
   */
  const userTreeData = useMemo(() => {
    if (!sourceData || !auth.userId) return [];
    return sourceData.filter((tree) => tree.properties.owner === auth.userId);
  }, [sourceData, auth.userId]);

  useEffect(() => {
    if (localStorage.getItem("seenInfoModal") === null) {
      localStorage.setItem("seenInfoModal", true);
      onTutorialOpen();
    }
  }, [auth, onTutorialOpen]);

  const setMapCoordinatesToTreeAtIndex = useCallback(
    (index) => {
      if (!googleMap || userTreeData.length === 0) return;

      const currentTreeCoords = userTreeData[index].geometry.coordinates;
      googleMap.setCenter({
        lat: currentTreeCoords[1],
        lng: currentTreeCoords[0],
      });
      googleMap.setZoom(STANDARD_ZOOM);
    },
    [googleMap, userTreeData]
  );

  function handleZoomTreesClick() {
    if (userTreeData.length === 0) return;

    setMapCoordinatesToTreeAtIndex(
      (treeIndexToFocus + 1) % userTreeData.length
    );
    setTreeIndexToFocus((index) => (index + 1) % userTreeData.length);
  }

  //
  // Focus initially on the first tree
  //
  const initialFocusExecuted = useRef(false);
  useEffect(() => {
    if (locationState) {
      setTreeIndexToFocus(
        userTreeData.findIndex(
          (tree) => tree.properties.id === locationState?.treeId
        ) || 0
      );
    }

    if (
      !googleMap ||
      initialFocusExecuted.current ||
      locationState ||
      userTreeData.length === 0
    ) {
      return;
    }
    initialFocusExecuted.current = true;
    setMapCoordinatesToTreeAtIndex(0);
  }, [locationState, googleMap, setMapCoordinatesToTreeAtIndex, userTreeData]);

  const calculateColor = useCallback(
    (point) => {
      const { owner, date } = point?.properties || {};
      if (owner) {
        return owner === auth.userId ? yourTreeColor : adoptedTreeColor;
      } else {
        return isNewTree(date) ? newTreeColor : oldTreeColor;
      }
    },
    [auth.userId]
  );

  const calculatePointRadius = useCallback(
    (point) => {
      const { owner, date } = point?.properties || {};
      if (!isNewTree(date)) return 1;
      if (owner === auth.userId) {
        let factor = 20 - currentZoom;
        if (factor < 0) factor = 1;
        return clamp(Math.pow(2, factor), 3, 16);
      } else {
        return 3;
      }
    },
    [auth.userId, currentZoom]
  );

  const onPointClick = useCallback(
    (point) => {
      if (!isNewTree(point.object.properties.date)) return;

      const treeId = point.object.properties.id;
      const owner = point.object.properties.owner;

      if (!owner) {
        setIdOfTree(treeId);
        onAdoptOpen();
      } else if (owner === auth.userId) {
        setIdOfTree(treeId);
        onMyTreeOpen();
      }
    },
    [auth.userId, onAdoptOpen, onMyTreeOpen]
  );

  const onPointHover = useCallback(
    (point) => {
      if (point === null) {
        setTooltip('');
        return;
      }

      setTreeData({x: point?.x, y: point?.y});
      setTooltip(prevTooltip => point?.object?.properties?.type);
    },
    []
  );

  useEffect(() => {
    if (!deckOverlay || !googleMap) return;

    deckOverlay.setMap(googleMap);
    deckOverlay.setProps({
      getCursor: ({ isHovering, isDragging }) => {
        if (isHovering) {
          googleMap.setOptions({ draggableCursor: "pointer" });
        } else {
          googleMap.setOptions({ draggableCursor: "" });
        }
        return "grab";
      },
    });
  }, [deckOverlay, googleMap]);

  function getIcon(tree) {
    const { owner, date } = tree?.properties || {};
  
    // Generate a number between 1 and 3
    
  
    if (owner) {
      return owner === auth.userId ? 'yourTree2' : 'adoptedTree4';
    } else {
      return isNewTree(date) ? 'tree2' : 'oldTree3';
    }
  }
  


  function mapValue() {
    // Ensure the input currentZoom is within the 14 and 22 range
    let curr = currentZoom;
    curr = Math.min(Math.max(curr, 14), 22);

    if(curr > 19){
      return 100;
    }

    return ((curr - 14) / (22 - 14)) * (30 - 10) + 10;
  }

  useEffect(() => {
    if (!deckOverlay || !sourceData || !auth.userId) return;
  
    const orderedData = orderedTreeData(sourceData, auth);



    //14 - 22


    deckOverlay.setProps({
      layers: [
        new IconLayer({
          id: "icon-layer",
          data: orderedData,
          pickable: true,
          iconAtlas: iconAtlas, // Use the same image for all icons
          iconMapping: atlas, // Adjust the icon mapping properties
          getIcon: (tree) => getIcon(tree), // Use the 'tree' icon name from the mapping for each tree
          getPosition: (tree) => tree.geometry.coordinates, // Get the tree coordinates
          sizeScale: mapValue(), // Adjust the size of the icons
          onClick: onPointClick,
        }),
      ],
    });
  }, [auth, deckOverlay, onPointClick, sourceData, currentZoom]);

  async function handleZipCodeSearch() {
    zipCodeSearch(auth.token, zip)
      .then((response) => {
        googleMap.setCenter({
          lat: response.y,
          lng: response.x,
        });
        googleMap.setZoom(STANDARD_ZOOM);
        onSearchClose(false);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }

  function focusOnUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!googleMap) return;

          googleMap.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          googleMap.setZoom(STANDARD_ZOOM);

          toastSuccess(toast, greekLabels.SUCCESSFUL_GEOLOCATION);
        },
        (error) => {
          console.error("Error getting current position: " + error.message);
        }
      );
    } else {
      toastError(toast, greekLabels.FAILED_GEOLOCATION);
    }
  }

  return (
    <Flex alignSelf="stretch" justify="center" flex="1" id="map-container">
      <Box display={!sourceData && "none"} flex="1" id="google-map" />

      {!sourceData ? (
        <Flex
          alignSelf="stretch"
          direction="column"
          justify="center"
          align="center"
          w="90%"
        >
          <Heading align="center" size="lg" mb={10}>
            {greekLabels.LOADING_TREES}
          </Heading>
          <Progress w="full" colorScheme="green" size="sm" isIndeterminate />
        </Flex>
      ) : (
        <>
          {tooltip && (
            <Box
              position="absolute" top={treeData.y-40} left={treeData.x}
              backgroundColor="var(--pale-yellow-trans)"
              borderRadius="5px" padding="5px" border="1px solid grey">
              {tooltip}
            </Box>
          )}
          <IconButton
            aria-label="Show info"
            size="lg"
            fontSize="2rem"
            colorScheme="green"
            pos="absolute"
            top="10px"
            left="10px"
            borderRadius="3px"
            boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
            icon={<TiInfoLarge />}
            onClick={onTutorialOpen}
          />

          <IconButton
            aria-label="My trees"
            size="lg"
            fontSize="2rem"
            colorScheme="green"
            pos="absolute"
            bottom="150px"
            left="10px"
            borderRadius="3px"
            boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
            icon={
              <Icon>
                <TreeIcon />
              </Icon>
            }
            isDisabled={userTreeData.length === 0}
            onClick={handleZoomTreesClick}
          />

          <IconButton
            aria-label="Search zip"
            size="lg"
            fontSize="2rem"
            colorScheme="green"
            pos="absolute"
            bottom="90px"
            left="10px"
            borderRadius="3px"
            boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
            icon={<BiSearch />}
            onClick={onSearchOpen}
          />

          <IconButton
            aria-label="Go to current location"
            size="lg"
            fontSize="2rem"
            colorScheme="green"
            pos="absolute"
            bottom="30px"
            left="10px"
            borderRadius="3px"
            boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
            icon={<TbFocus2 />}
            onClick={focusOnUser}
          />
        </>
      )}

      <AdoptModal
        isAdoptOpen={isAdoptOpen}
        onAdoptClose={onAdoptClose}
        auth={auth}
        setSourceData={setSourceData}
        idOfTree={idOfTree}
      />

      <MyTreeModal
        isMyTreeOpen={isMyTreeOpen}
        onMyTreeClose={onMyTreeClose}
        auth={auth}
        setSourceData={setSourceData}
        idOfTree={idOfTree}
      />

      <SearchZipModal
        isSearchOpen={isSearchOpen}
        onSearchClose={onSearchClose}
        setZip={setZip}
        zip={zip}
        handleZipCodeSearch={handleZipCodeSearch}
      />

      <TutorialModal
        isTutorialOpen={isTutorialOpen}
        onTutorialClose={onTutorialClose}
      />
    </Flex>
  );
}

export default MapDeckGl;
