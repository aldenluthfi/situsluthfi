import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = ['Central Singapore', 'North East Singapore', 'North West Singapore', 'South East Singapore', 'South West Singapore'];

export interface SingaporeProps extends Omit<MapProps, 'stateCode'> { }

const Singapore = (props: SingaporeProps) => {
    return <Map stateCode={stateCode} {...props} />;
};

export default Singapore;
