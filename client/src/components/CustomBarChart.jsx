import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatMonth } from '../lib/utils';

const CustomBarChart = ({data}) => {
  return <BarChart
      style={{ width: '100%', maxWidth: '500px', maxHeight: '50vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id.month"
      type="category"
      tickFormatter={formatMonth}
      />
      
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalIn" fill="#22c55e" activeBar={{ fill: 'green', stroke: 'blue' }} radius={[4, 4, 0, 0]} />
      <Bar dataKey="totalOut" fill="#ef4444" activeBar={{ fill: 'red', stroke: 'purple' }} radius={[4, 4, 0, 0]} />
    </BarChart>
}

export default CustomBarChart