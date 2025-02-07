# Task Queue Deloader 🚀

Task Queue Deloader is a background job processing system that integrates **RabbitMQ** and **BullMQ (Redis)** to efficiently handle asynchronous tasks. It provides **reliability, automatic retries, monitoring, and easy scaling**, making it ideal for microservices and high-load applications.

## 📌 Features
- ✅ **RabbitMQ Integration** – Accepts tasks from external services.
- ✅ **BullMQ (Redis) for Queue Management** – Manages job execution efficiently.
- ✅ **Automatic Retries** – Configurable attempts and exponential backoff.
- ✅ **Prometheus & Grafana Monitoring** – Track system performance with real-time metrics.
- ✅ **Docker Support** – Easy deployment with Redis, RabbitMQ, and Prometheus.
- ✅ **WebSockets (Planned)** – Optional real-time task updates.

---

## 🚀 Getting Started

### 1️⃣ **Run Redis & RabbitMQ**
To start the required services, use Docker:
```sh
# Start RabbitMQ with management UI
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# Start Redis
docker run -d --name redis -p 6379:6379 redis
```

Alternatively, start all services using `docker-compose`:
```sh
docker-compose up -d
```

---

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Start the Application**
```sh
npm run start:dev
```

The service will be available at **`http://localhost:3020`**.

---

## 🔥 Using the Queue System

### **Sending a Task via RabbitMQ**
To send a task directly to RabbitMQ, use the provided `TaskProducer`:
```ts
await taskProducer.sendToQueue('email-queue', { message: 'Send email' });
```

### **Processing Tasks in the Worker**
Workers listen for tasks and process them asynchronously:
```ts
@Process('process-task')
async handleTask(job: Job) {
  console.log(`Processing task ${job.id}:`, job.data);
}
```

---

## 💊 Monitoring & Metrics

### **Check RabbitMQ Management UI**
Visit `http://localhost:15672` and log in with:
- **Username:** `guest`
- **Password:** `guest`

### **Check Prometheus Metrics**
```sh
curl http://localhost:3020/metrics
```
- Prometheus scrapes metrics automatically at **http://localhost:9090**.
- Available metrics include **completed jobs, queue size, and processing time**.

### **View Metrics in Grafana**
1. Install and start Grafana:
   ```sh
   docker run -d --name grafana -p 3000:3000 grafana/grafana
   ```
2. Connect it to Prometheus (`http://localhost:9090`).
3. Use the built-in dashboards or create custom visualizations.

---

## ✅ Running Tests
Run unit and integration tests to verify functionality:
```sh
npm run test
```

---

## 📝 License
This project is licensed under the **MIT** license.

---
🚀 **Now your task queue system is ready for production!**

