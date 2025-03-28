import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import PerformanceHeader from './PerformanceHeader/PerformaceHeader';
import PerformanceTable from './PerformanceTable/PerformanceTable';
import PerformanceChart from './PerformanceChart/PerformanceChart';
import styles from './TestResult.module.css';
import axios from '../../config/axiosLessonsConfig';

const TestResult = ({open, onCloseClick, data}) => {
    const [showChart, setShowChart] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('time');
    const [testName, setTestName] = useState('Название тестирования');
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSaveClick = async () => {
        data[currentIndex].title = testName;
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.post('/test', data[currentIndex], {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            }); 
        } catch (error) {
            console.error("Error save data:", error);
        }
    }

    const handleGenerateClick = async () => {
        try {
            const request = {"test_list": data[currentIndex].data};
            const response = await axios.post('/report', request, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });
            if (response.status === 200) {
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const fileUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = 'report.pdf';
                link.click();
                URL.revokeObjectURL(fileUrl);
            } else {
                alert("Произошла ошибка при генерации отчета");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (data && data.length > 0) {
            setCurrentIndex(0);
        }
    }, [data]);

    return (
        <Modal open={open} onCloseClick={onCloseClick} style={{ width: '85vw', maxWidth: '1200px' }}>
            {data && (
                <div className={styles.container}>
                    {data.length > 1 && <div className={styles.resultButtons}>
                        {data.map((_, index) => (
                            <button 
                                key={index} 
                                className={index == currentIndex ? styles.active : ""} 
                                onClick={() => setCurrentIndex(index)}
                            >
                                Результат {index}
                            </button>
                        ))}
                    </div>} 
                    <PerformanceHeader
                        testName={testName}
                        setTestName={setTestName}
                        onSaveClick={handleSaveClick}
                        onGenerateClick={handleGenerateClick}
                        showChart={showChart}
                        setShowChart={setShowChart}
                    />
                    
                    <div className={styles.content}>
                        {data[currentIndex].data.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles.test_item}>
                                <h2 className={styles.item_title}>{item.title}</h2>
                                {item.data.map((argItem, argIndex) => (
                                    <div key={argIndex}>
                                        <p className={styles.item_args}>{argItem.args}</p>
                                        {showChart ? (
                                            <PerformanceChart 
                                                data={argItem.performance}
                                                selectedMetric={selectedMetric}
                                                onMetricChange={setSelectedMetric}
                                            />
                                        ) : (
                                            <PerformanceTable performance={argItem.performance} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default TestResult;