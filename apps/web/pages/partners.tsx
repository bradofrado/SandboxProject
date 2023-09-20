import {type GetStaticProps, type NextPage} from 'next';

export const getStaticProps: GetStaticProps = () => {
    return {props: {}}
}

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