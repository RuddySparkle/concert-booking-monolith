import axiosClient from './axiosClient';

export interface Concert {
    id: string;
    name: string;
    description: string;
    totalSeats: number;
    availableSeats: number;
}

const getConfig = (userId: string = 'admin-1') => ({
    headers: {
        'User-Id': userId
    }
});

export const getAllConcerts = async (userId: string = 'admin-1'): Promise<Concert[]> => {
    const response = await axiosClient.get('/user/concerts', getConfig(userId));
    return response.data;
};

export const deleteConcert = async (id: string): Promise<void> => {
    await axiosClient.delete(`/admin/concerts/${id}`, getConfig('admin-1'));
};

export const createConcert = async (data: { name: string, description: string, totalSeats: number }) => {
    const response = await axiosClient.post('/admin/concerts', data, getConfig('admin-1'));
    return response.data;
}
