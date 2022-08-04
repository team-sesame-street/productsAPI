import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '2m',
};
// export const options = {
//   stages: [
//     { duration: '30s', target:50},
//     { duration: '2m', target:100},
//     { duration: '30s', target:50}
//   ]
// };

export default function test() {
  const res = http.get('http://127.0.0.1:3000/products/1/styles');

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
