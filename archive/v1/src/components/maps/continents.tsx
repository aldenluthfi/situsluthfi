import Map, { type MapProps } from '@/components/maps/generic-map';

const stateCode = ['Africa', 'Asia', 'Australia and Oceania', 'Europe', 'South America', 'North America'];

export interface ContinentsProps extends Omit<MapProps, 'stateCode'> {}

const Continents = (props: ContinentsProps) => {
    return <Map stateCode={stateCode} {...props} />;
};

export default Continents;
