import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTrades, addTrade, updateTrade, deleteTrade } from '../api/trades';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

type Trade = {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
  type: 'buy' | 'sell';
  notes: string;
};

type TradeFormData = Omit<Trade, 'id'>;

const TradeJournal: React.FC = () => {
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<TradeFormData>();
  const queryClient = useQueryClient();

  const { data: trades, isLoading, error } = useQuery('trades', fetchTrades);

  const addTradeMutation = useMutation(addTrade, {
    onSuccess: () => {
      queryClient.invalidateQueries('trades');
      reset();
    },
  });

  const updateTradeMutation = useMutation(updateTrade, {
    onSuccess: () => {
      queryClient.invalidateQueries('trades');
      setEditingTrade(null);
      reset();
    },
  });

  const deleteTradeMutation = useMutation(deleteTrade, {
    onSuccess: () => {
      queryClient.invalidateQueries('trades');
    },
  });

  const onSubmit = (data: TradeFormData) => {
    if (editingTrade) {
      updateTradeMutation.mutate({ id: editingTrade.id, ...data });
    } else {
      addTradeMutation.mutate(data);
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    Object.keys(trade).forEach((key) => {
      setValue(key as keyof TradeFormData, trade[key as keyof Trade]);
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTradeMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade Journal</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Symbol</label>
            <input
              type="text"
              id="symbol"
              {...register('symbol', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              {...register('type', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              {...register('date', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700">Entry Price</label>
            <input
              type="number"
              id="entryPrice"
              step="0.01"
              {...register('entryPrice', { required: true, min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-700">Exit Price</label>
            <input
              type="number"
              id="exitPrice"
              step="0.01"
              {...register('exitPrice', { required: true, min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              {...register('quantity', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ringfocus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingTrade ? 'Update Trade' : 'Add Trade'}
          <PlusCircle className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades?.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(trade.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trade.entryPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trade.exitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${((trade.exitPrice - trade.entryPrice) * trade.quantity).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(trade)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeJournal;