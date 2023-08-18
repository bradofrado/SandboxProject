import {type GetStaticProps, type NextPage} from 'next';
import { useRouter } from 'next/router';
import Header from '~/utils/components/base/header';
import { SidePanel, type SidePanelItems } from '~/utils/components/base/side-panel';

export const getStaticProps: GetStaticProps = () => {
    return {props: {}}
}

interface Partner {
    name: string,
    id: string,
    // nickname: string,
    // website: string
}

const partner: Partner[] = [
    {
        name: 'Craig Swapp & Associates',
        id: '1'
    }
]