import { type NextPage} from 'next';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';

export const getServerSideProps = requireAuth(defaultGetServerProps);

export interface Partner {
    name: string,
    id: string,
    // nickname: string,
    // website: string
}

const Partners: NextPage = () => {
    return (
        <>
        </>
    );
};

export default Partners;