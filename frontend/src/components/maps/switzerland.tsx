import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Aargau',
    'Appenzell Inner-Rhoden',
    'Appenzell Ausser-Rhoden',
    'Bern',
    'Basel-Landschaft',
    'Basel-Stadt',
    'Fribourg',
    'Genève',
    'Glarus',
    'Graubünden',
    'Jura',
    'Lucerne',
    'Neuchâtel',
    'Nidwalden',
    'Obwalden',
    'Sankt Gallen',
    'Schaffhausen',
    'Solothurn',
    'Schwyz',
    'Thurgau',
    'Ticino',
    'Uri',
    'Vaud',
    'Valais',
    'Zug',
    'Zürich'
];

export interface SwitzerlandProps extends Omit<MapProps, 'stateCode'> { }

const Switzerland = (props: SwitzerlandProps) => {
    return <Map name='Switzerland' stateCode={stateCode} {...props} />;
};

export default Switzerland;
