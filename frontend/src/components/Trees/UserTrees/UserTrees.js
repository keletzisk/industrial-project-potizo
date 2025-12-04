import React, { useContext, useEffect, useState } from "react";
import { TreeCardSlider } from "../TreeCardSlider/TreeCardSlider";
import { AuthContext } from "../../../context/auth-context";
import { useToast } from "@chakra-ui/toast";
import { fetchTreesOfUser } from "services/api";
import { Flex, Spinner } from "@chakra-ui/react";
import { toastError } from "util/helpers";

function UserTrees() {
  const toast = useToast();
  const [loadedTrees, setLoadedTrees] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetchTreesOfUser(auth.token)
      .then((trees) => {
        setLoadedTrees(trees);
      })
      .catch((error) => {
        toastError(toast, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auth.token, toast]);

  return loading ? (
    <Flex justify="center" align="center" mt={20}>
      <Spinner speed="0.6s" thickness="4px" colorScheme="green" size="xl" />
    </Flex>
  ) : (
    <TreeCardSlider trees={loadedTrees} setLoadedTrees={setLoadedTrees} />
  );
}

export default UserTrees;
