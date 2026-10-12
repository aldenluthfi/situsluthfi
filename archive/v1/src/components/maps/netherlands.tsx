import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Drenthe',
    'Flevoland',
    'Friesland',
    'Gelderland',
    'Groningen',
    'Limburg Netherlands',
    'Noord-Brabant',
    'Noord-Holland',
    'Overijssel',
    'Utrecht',
    'Zeeland',
    'Zuid-Holland'
];

export interface NetherlandsProps extends Omit<MapProps, 'stateCode'> { }

const Netherlands = (props: NetherlandsProps) => {
    return <Map name='Netherlands' stateCode={stateCode} {...props} />;
};

export default Netherlands;
