import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = [
    'Seoul',
    'Busan',
    'Daegu',
    'Incheon',
    'Gwangju',
    'Daejeon',
    'Ulsan',
    'Gyeonggi',
    'Gangwon',
    'North Chungcheong',
    'South Chungcheong',
    'North Jeolla',
    'South Jeolla',
    'North Gyeongsang',
    'South Gyeongsang',
    'Jeju',
    'Sejong'
];

export interface SouthKoreaProps extends Omit<MapProps, 'stateCode'> { }

const SouthKorea = (props: SouthKoreaProps) => {
    return <Map stateCode={stateCode} {...props} />;
};

export default SouthKorea;
