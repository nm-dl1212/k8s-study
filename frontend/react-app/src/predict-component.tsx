import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosResponse } from "axios";

interface ResponseType {
    input: number;
    prediction: number;
    timestamp: string;
    uuid: string;
}

const PredictComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [response, setResponse] = useState<ResponseType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const res: AxiosResponse<ResponseType>
                = await axios.post('api/predict', {
                    input: [parseFloat(inputValue)]
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 3000,
                });
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setResponse(null);
            setError('Error occurred while fetching prediction.');
        }
    };

    const [healthStatus, setHealthStatus] = useState<string | null>(null);

    const checkHealth = async (): Promise<void> => {
        try {
            const res: AxiosResponse<ResponseType> = await axios.get('api/health', { timeout: 3000 });
            console.log(res.data)
            setHealthStatus('API is healthy');
        } catch (err) {
            console.log("unhealty")
            setHealthStatus('API is not healthy');
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Input Value:
                    <input type="text" value={inputValue} onChange={handleInputChange} />
                </label>
                <button type="submit">Predict</button>
            </form>

            {healthStatus && <p>Health Status: {healthStatus}</p>}

            {error && <p>{error}</p>}

            {response && (
                <div>
                    <h3>Response</h3>
                    <p><strong>Input:</strong> {JSON.stringify(response.input)}</p>
                    <p><strong>Prediction:</strong> {JSON.stringify(response.prediction)}</p>
                    <p><strong>Timestamp:</strong> {response.timestamp}</p>
                    <p><strong>UUID:</strong> {response.uuid}</p>
                </div>
            )}
        </div>
    );
};

export default PredictComponent;
