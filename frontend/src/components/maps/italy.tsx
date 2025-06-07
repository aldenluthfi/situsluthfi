import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Vatican City Italy',
    'San Marino Italy',
    'Corsica',
    'Malta Italy',
    'Abruzzo',
    'Basilicata',
    'Calabria',
    'Campania',
    'Emilia-Romagna',
    'Friuli-Venezia Giulia',
    'Lazio',
    'Liguria',
    'Lombardia',
    'Marche',
    'Molise',
    'Piemonte',
    'Puglia',
    'Sardegna',
    'Sicilia',
    'Toscana',
    'Trentino-Alto Adige',
    'Umbria',
    "Valle d'Aosta",
    'Veneto'
];

export interface ItalyProps extends Omit<MapProps, 'stateCode'> { }

const Italy = (props: ItalyProps) => {
    return <Map name='Italy' stateCode={stateCode} {...props} />;
};

export default Italy;
