import { getClass } from "model/src/utils";
import { CheckIcon } from "../core/icons";

export interface StatusTrackerProps {
  statuses: readonly string[];
  value: string | undefined;
  className?: string;
}
export const StatusTracker: React.FunctionComponent<StatusTrackerProps> = ({
  statuses,
  value,
  className,
}) => {
  const valueIndex = value ? statuses.indexOf(value) : statuses.length;
	
	const getStatusComponent = (statusIdx: number): StatusComponent => {
		if (statusIdx < valueIndex) {
			return StatusComplete;
		}

		if (statusIdx === valueIndex) {
			return StatusCurrent;
		}

		return StatusUpcoming;
	}
  return (
    <nav className={className}>
      <ol className="flex items-center">
        {statuses.map((status, statusIdx) => {
					const StatusComponent = getStatusComponent(statusIdx);
          return <li className={`${statusIdx === 0 || statusIdx === statuses.length - 1 ? 'w-1/2' : 'w-full'}`} key={status}>
            <div className={getClass('relative')}>
							<StatusComponent isFirst={statusIdx === 0} isLast={statusIdx === statuses.length - 1}>{status}</StatusComponent>
						</div>
						<div className="text-sm mt-1 text-center">{status}</div>
          </li>
				})}
      </ol>
    </nav>
  );
};

type StatusComponent = React.FunctionComponent<{children: string, isLast: boolean, isFirst: boolean}>;

const StatusComplete: StatusComponent = ({children, isLast, isFirst}) => {
	return <>
		<div aria-hidden="true" className="absolute inset-0 flex items-center">
			{!isFirst ? <div className="h-0.5 w-1/2 bg-primary left-0 absolute" /> : null}
			{!isLast ? <div className="h-0.5 left-1/2 w-1/2 bg-primary absolute" /> : null}
		</div>
		<div
			className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary-dark left-1/2 -translate-x-1/2"
		>
			<CheckIcon aria-hidden="true" className="h-5 w-5 text-white" />
			<span className="sr-only">{children}</span>
		</div>
	</>
}

const StatusCurrent: StatusComponent = ({children, isLast, isFirst}) => {
	return <>
		<div aria-hidden="true" className="absolute inset-0 flex items-center">
		{!isFirst ? <div className="h-0.5 w-1/2 bg-primary left-0 absolute" /> : null}
			{!isLast ? <div className="h-0.5 left-1/2 w-1/2 bg-gray-200 absolute" /> : null}
		</div>
		<div
			className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white left-1/2 -translate-x-1/2"
		>
			<span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary" />
			<span className="sr-only">{children}</span>
		</div>
	</>
}

const StatusUpcoming: StatusComponent = ({children, isLast, isFirst}) => {
	return <>
		<div aria-hidden="true" className="absolute inset-0 flex items-center">
		{!isFirst ? <div className="h-0.5 w-1/2 bg-gray-200 left-0 absolute" /> : null}
			{!isLast ? <div className="h-0.5 left-1/2 w-1/2 bg-gray-200 absolute" /> : null}
		</div>
		<div
			className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 left-1/2 -translate-x-1/2"
		>
			<span
				aria-hidden="true"
				className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
			/>
			<span className="sr-only">{children}</span>
		</div>
	</>
}
