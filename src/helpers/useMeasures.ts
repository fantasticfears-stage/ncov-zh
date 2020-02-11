import * as React from 'react';
import { IDimension } from '../models';

const MIN_WIDTH = 500;
const MIN_HEIGHT = 400;
const MAX_HEIGHT = 800;

export function useMeasures(
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>,
  values: d3.ExtendedFeatureCollection
): [
  React.RefObject<HTMLElement>,
  React.RefObject<HTMLDivElement>,
  IDimension
] {
  const containerRef = React.createRef<HTMLElement>();
  const measureRef = React.createRef<HTMLDivElement>();
  const [dimension, setDimension] = React.useState({
    width: MIN_WIDTH,
    height: MIN_HEIGHT
  });
  
  React.useEffect(() => {
    if (measureRef.current && containerRef.current) {
      const docRect = containerRef.current.getBoundingClientRect();
      const measureRect = measureRef.current.getBoundingClientRect();
      let height = docRect.height - measureRect.top;
      const mapYBoundRaw = geoGenerator.bounds(values)[1][1];
      let maxHeight = mapYBoundRaw >= Infinity || mapYBoundRaw <= -Infinity ? MAX_HEIGHT : mapYBoundRaw;
      if (maxHeight < MIN_HEIGHT) {
        maxHeight = MIN_HEIGHT;
      }
      height = Math.max(height, maxHeight);
      if (height < MIN_HEIGHT) {
        height = MIN_HEIGHT;
      } else if (height > maxHeight) {
        height = maxHeight;
      }

      if (height !== dimension.height || dimension.width !== measureRect.width) {
        setDimension({
          height,
          width: measureRect.width
        });
      }
    }
  }, [measureRef, containerRef, dimension.height, dimension.width, geoGenerator, values]);
  return [containerRef, measureRef, dimension];
}
