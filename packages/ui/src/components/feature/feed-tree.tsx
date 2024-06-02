import {displayElapsedTime, getClass} from 'model/src/utils';
import type { PatientFeedType} from 'model/src/patient';
import { patientStatuses } from 'model/src/patient';
import {
  CheckCircleSolidIcon
} from '../core/icons'

type FeedActivityType = PatientFeedType;
interface FeedActivityPerson {
	name: string,
	imageUrl?: string
}
interface FeedActivity {
	id: string,
	type: FeedActivityType,
	note: string,
	person: FeedActivityPerson,
	date: Date
}

// const activity: FeedActivity[] = [
//   { id: 1, type: 'created', note: 'invoice', person: { name: 'Chelsea Hagon' }, date: calculateDateDifference(7 * day)},
//   { id: 2, type: 'edited', note: 'invoice', person: { name: 'Chelsea Hagon' }, date: calculateDateDifference(6 * day)},
//   { id: 3, type: 'sent', note: 'invoice', person: { name: 'Chelsea Hagon' }, date: calculateDateDifference(6 * day)},
//   {
//     id: 4,
//     type: 'commented',
//     person: {
//       name: 'Chelsea Hagon',
//       imageUrl:
//         'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     object: 'Called client, they reassured me the invoice would be paid by the 25th.',
//     date: calculateDateDifference(3*day)
//   },
//   { id: 5, type: 'viewed', object: 'invoice', person: { name: 'Alex Curren' }, date: calculateDateDifference(2*day)},
//   { id: 6, type: 'paid', object: 'invoice', person: { name: 'Alex Curren' }, date: calculateDateDifference(day)},
// ]
// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

const getFeedDescription = (item: FeedActivity): React.ReactNode => {
	switch(item.type) {
		case 'comment':
		case 'appointment': return item.note;
		case 'request': return 'requested documents';
		case 'send': return 'sent documents';
		case 'status': {
			const statusIndex = patientStatuses.findIndex(status => status === item.note);
			if (statusIndex < 0) throw new Error(`Invalid status ${item.note}`);

			const prevStatus = statusIndex > 0 ? patientStatuses[statusIndex - 1] : undefined;
			const currStatus = patientStatuses[statusIndex];

			if (prevStatus === undefined) {
				return <span>status was moved to <span className="font-medium text-gray-900">{currStatus}</span></span>
			}

			return <span>status was moved from <span className="font-medium text-gray-900">{prevStatus}</span> to <span className="font-medium text-gray-900">{currStatus}</span></span>;
		}
	}
}

export interface FeedTreeProps {
	items: FeedActivity[]
}
export const FeedTree: React.FunctionComponent<FeedTreeProps> = ({items}) => {
  //const [selected, setSelected] = useState(moods[5])

  return (
    <>
      <ul className="space-y-6">
        {items.map((activityItem, activityItemIdx) => (
          <li className="relative flex gap-x-4" key={activityItem.id}>
            <div
              className={getClass(
                activityItemIdx === items.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            {activityItem.type === 'comment' ? (
              <>
                {activityItem.person.imageUrl ? <img
                  alt=""
                  className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                  src={activityItem.person.imageUrl}
                /> : <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
									<div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
								</div>}
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500">
                      <span className="font-medium text-gray-900">{activityItem.person.name}</span> commented
                    </div>
                    <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={activityItem.date.toLocaleDateString()}>
                      {displayElapsedTime(activityItem.date)}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">{activityItem.note}</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {activityItem.type === 'send' ? (
                    <CheckCircleSolidIcon aria-hidden="true" className="h-6 w-6 text-primary" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-900">{activityItem.person.name}</span> {getFeedDescription(activityItem)}
                </p>
                <time className="flex-none py-0.5 text-xs leading-5 text-gray-500" dateTime={activityItem.date.toLocaleTimeString()}>
                  {displayElapsedTime(activityItem.date)}
                </time>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* New comment form */}
      <div className="mt-6 flex gap-x-3">
        <img
          alt=""
          className="h-6 w-6 flex-none rounded-full bg-gray-50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
        <form action="#" className="relative flex-auto">
          <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary">
            <label className="sr-only" htmlFor="comment">
              Add your comment
            </label>
            <textarea
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              defaultValue=""
              id="comment"
              name="comment"
              placeholder="Add your comment..."
              rows={2}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
            {/* <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                  type="button"
                >
                  <PaperClipIcon aria-hidden="true" className="h-5 w-5" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox onChange={setSelected} value={selected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">Your mood</Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {selected.value === null ? (
                              <span>
                                <FaceSmileIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                                <span className="sr-only">Add your mood</span>
                              </span>
                            ) : (
                              <span>
                                <span
                                  className={getClass(
                                    selected.bgColor,
                                    'flex h-8 w-8 items-center justify-center rounded-full'
                                  )}
                                >
                                  <selected.icon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-white" />
                                </span>
                                <span className="sr-only">{selected.name}</span>
                              </span>
                            )}
                          </span>
                        </Listbox.Button>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          show={open}
                        >
                          <Listbox.Options className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            {moods.map((mood) => (
                              <Listbox.Option
                                className={({ active }) =>
                                  getClass(
                                    active ? 'bg-gray-100' : 'bg-white',
                                    'relative cursor-default select-none px-3 py-2'
                                  )
                                }
                                key={mood.value}
                                value={mood}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={getClass(
                                      mood.bgColor,
                                      'flex h-8 w-8 items-center justify-center rounded-full'
                                    )}
                                  >
                                    <mood.icon
                                      aria-hidden="true"
                                      className={getClass(mood.iconColor, 'h-5 w-5 flex-shrink-0')}
                                    />
                                  </div>
                                  <span className="ml-3 block truncate font-medium">{mood.name}</span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div> */}
            <button
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              type="submit"
            >Send</button>
          </div>
        </form>
      </div>
    </>
  )
}
