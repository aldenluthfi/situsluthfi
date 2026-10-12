import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode: string[] = [
    'Andalusia',
    'Aragon',
    'Asturias',
    'Cantabria',
    'Castile and Leon',
    'Castile-La Mancha',
    'Canary Islands',
    'Catalonia',
    'Extremadura',
    'Galicia',
    'La Rioja',
    'Madrid',
    'Murcia',
    'Navarra',
    'Balearic Islands',
    'Basque Country',
    'Valencia'
];

export interface SpainProps extends Omit<MapProps, 'stateCode'> { }

const Spain = (props: SpainProps) => {
    return <Map name='Spain' stateCode={stateCode} {...props} />;
};

export default Spain;
