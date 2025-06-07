import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Alsace',
    'Aquitaine',
    'Auvergne',
    'Bourgogne',
    'Bretagne',
    'Centre',
    'Champagne-Ardenne',
    'Corse',
    'Franche-Comté',
    'Île-de-France',
    'Languedoc-Roussillon',
    'Limousin',
    'Lorraine',
    'Midi-Pyrénées',
    'Nord-Pas-de-Calais',
    'Basse-Normandie',
    'Haute-Normandie',
    'Pays de la Loire',
    'Picardie',
    'Poitou-Charentes',
    "Provence-Alpes-Côte d'Azur",
    'Rhône-Alpes'
];

export interface FranceProps extends Omit<MapProps, 'stateCode'> { }

const France = (props: FranceProps) => {
    return <Map name='France' stateCode={stateCode} {...props} />;
};

export default France;
