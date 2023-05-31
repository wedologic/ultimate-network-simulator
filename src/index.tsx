import {Consultant, ConsultantRecord} from '@/utility/network';

const consultants: ConsultantRecord[] = [
  {
    code: '1',
    sponsorCode: null,
    salesPoints: 2500,
  },
  {
    code: '2',
    sponsorCode: '1',
    salesPoints: 5000,
  },
  {
    code: '3',
    sponsorCode: '1',
    salesPoints: 4000,
  },
  {
    code: '4',
    sponsorCode: '1',
    salesPoints: 1500,
  },
  {
    code: '5',
    sponsorCode: '2',
    salesPoints: 3000,
  },
  {
    code: '6',
    sponsorCode: '2',
    salesPoints: 2000,
  },
  {
    code: '7',
    sponsorCode: '4',
    salesPoints: 500,
  },
  {
    code: '8',
    sponsorCode: '7',
    salesPoints: 5000,
  },
  {
    code: '9',
    sponsorCode: '7',
    salesPoints: 4500,
  },
];

const rootConsultant = Consultant.make(consultants);
console.log(JSON.stringify(rootConsultant.getData(), null, 2));

// // import * as React from 'react';
// // import ReactDOM from 'react-dom';

// import {ConsultantRecord} from '@/types/consultant';

// import {Consultant} from '@/utility/consultant';

// // import '@/styles/base/normalize.scss';
// // import '@/styles/base/typography.scss';

// // import {App} from '@/components/app';

// // ReactDOM.render(
// //     <React.StrictMode>
// //       <App />
// //     </React.StrictMode>,
// //     document.getElementById('root'),
// // );

// export const consultants: ConsultantRecord[] = [
//   {
//     code: '1',
//     fullName: 'A',
//     sponsorCode: null,
//   },
//   {
//     code: '2',
//     fullName: 'B',
//     sponsorCode: '1',
//   },
//   {
//     code: '3',
//     fullName: 'C',
//     sponsorCode: '1',
//   },
//   {
//     code: '4',
//     fullName: 'D',
//     sponsorCode: '1',
//   },
//   {
//     code: '5',
//     fullName: 'E',
//     sponsorCode: '2',
//   },
//   {
//     code: '6',
//     fullName: 'E',
//     sponsorCode: '2',
//   },
//   {
//     code: '7',
//     fullName: 'F',
//     sponsorCode: '4',
//   },
//   {
//     code: '8',
//     fullName: 'G',
//     sponsorCode: '7',
//   },
//   {
//     code: '9',
//     fullName: 'H',
//     sponsorCode: '7',
//   },
// ];

// const c1 = Consultant.makeFromRecords(consultants);
// c1.getSales().add(50);

// const c4 = c1.getConsultantByCode('4');
// const c2 = c1.getConsultantByCode('2');
// const c7 = c1.getConsultantByCode('7');
// const c8 = c1.getConsultantByCode('8');
// const c9 = c1.getConsultantByCode('9');

// if (c4 && c8 && c7 && c9 && c2) {
//   c2.getSales().add(30).add(30);
//   c4.getSales().add(30).add(50);
//   c8.getSales().add(100).add(20);
//   c9.getSales().add(30).add(40);
// }

// console.log(c1.present());
