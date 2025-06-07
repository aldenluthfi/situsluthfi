import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Antwerp',
    'Walloon Brabant',
    'Brussels Capital Region',
    'Hainaut',
    'Liege',
    'Limburg Belgium',
    'Luxembourg',
    'Namur',
    'East Flanders',
    'Flemish Brabant',
    'West Flanders'
];

export interface BelgiumProps extends Omit<MapProps, 'stateCode'> { }

const Belgium = (props: BelgiumProps) => {
    return <Map name='Belgium' stateCode={stateCode} {...props} />;
};

export default Belgium;
