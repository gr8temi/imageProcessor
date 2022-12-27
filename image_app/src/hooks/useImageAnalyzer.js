import { useQuery } from "react-query";
import { useMemo } from "react";

const baseKey = "AnalyzeImage";
const retry = false;

const useImageAnalyzer = ({ imageId }) => {
  const key = [baseKey, imageId];

  const imageAnalyze = useQuery(
    key,
    () =>
      fetch(`${process.env.REACT_APP_BASE_URL}analyse_image/${imageId}/`).then(
        (res) => res.json()
      ),
    {
      enabled: !!imageId,
      retry,
    }
  );

  const imageAnalyzeData = useMemo(
    () => ({
      imageAnalyzeData: imageAnalyze.data,
      imageAnalyzeDataLoading: imageAnalyze.isLoading,
      imageAnalyzeDataError: imageAnalyze.error,
    }),
    [imageAnalyze]
  );

  return imageAnalyzeData;
};

export default useImageAnalyzer;
