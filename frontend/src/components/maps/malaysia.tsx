import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Selangor',
    'Terengganu',
    'Sabah',
    'Sarawak',
    'Kuala Lumpur',
    'Labuan',
    'Putrajaya'
];

export interface MalaysiaProps extends Omit<MapProps, 'stateCode'> { }

const Malaysia = (props: MalaysiaProps) => {
    return <Map name='Malaysia' stateCode={stateCode} {...props} />;
};

export default Malaysia;
