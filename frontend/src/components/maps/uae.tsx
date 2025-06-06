import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = [
    "'Ajmān",
    'Abū Z̧aby',
    'Dubayy',
    'Al Fujayrah',
    'Ra’s al Khaymah',
    'Ash Shāriqah',
    'Umm al Qaywayn',
    'Musandam, Oman',
    'Neutral Zone'
];

export interface UAEProps extends Omit<MapProps, 'stateCode'> { }

const UAE = (props: UAEProps) => {
    return <Map name='United Arab Emirates' stateCode={stateCode} {...props} />;
};

export default UAE;
