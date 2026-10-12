import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Baden-Wurttemberg',
    'Bavaria',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hesse',
    'Mecklenburg-Vorpommern',
    'Lower Saxony',
    'North Rhine-Westphalia',
    'Rhineland-Palatinate',
    'Saarland',
    'Saxony',
    'Saxony-Anhalt',
    'Schleswig-Holstein',
    'Thuringia'
];

export interface GermanyProps extends Omit<MapProps, 'stateCode'> { }

const Germany = (props: GermanyProps) => {
    return <Map name='Germany' stateCode={stateCode} {...props} />;
};

export default Germany;
