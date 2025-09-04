// user_analytics.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Line Chart: Login Trends ---
    fetch('/api/activity-trends/?type=Login')
        .then(response => response.json())
        .then(data => {
            if (data.labels.length > 0) {
                const ctx = document.getElementById('activityChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: `${data.activity_type} Trend`,
                            data: data.data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false,
                        }]
                    },
                    options: {
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching login data:', error));

    // --- Pie Chart: Activity Breakdown ---
    fetch('/api/activity-breakdown/')
        .then(response => response.json())
        .then(data => {
            if (data.labels.length > 0) {
                const ctx = document.getElementById('pieChart').getContext('2d');
                const pieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            data: data.data,
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        onClick: (event, activeElements) => {
                            if (activeElements.length > 0) {
                                const clickedIndex = activeElements[0].index;
                                const label = data.labels[clickedIndex];
                                window.location.href = `/activity/me/?type=${encodeURIComponent(label)}`;
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching breakdown data:', error));
    
    // --- Bar Chart: Most Viewed Products ---
    fetch('/api/most-viewed-products/')
        .then(response => response.json())
        .then(data => {
            if (data.labels.length > 0) {
                const ctx = document.getElementById('barChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Views',
                            data: data.data,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks: {
                                    maxRotation: 90,
                                    minRotation: 90
                                }
                            },
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
});