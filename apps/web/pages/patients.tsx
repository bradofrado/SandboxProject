import { type NextPage} from 'next';
import { useState } from 'react';
import { Header } from 'ui/src/components/core/header';
import { Input } from 'ui/src/components/core/input';
import {PatientsGrid} from 'ui/src/components/view/patient/patients-grid'

const Patients: NextPage = () => {
	const [searchKey, setSearchKey] = useState('');
    
    return <>
		<div className="flex justify-between items-center p-2">
			<Header level={2}>Patients</Header>
			<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
		</div>
		<PatientsGrid searchKey={searchKey}/>
	</>
}

export default Patients;