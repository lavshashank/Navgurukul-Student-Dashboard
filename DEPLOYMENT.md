# 🚀 Deployment Guide for Student Dashboard

## Pre-Deployment Checklist

- [ ] All dependencies are in `package.json`
- [ ] Environment variables are configured
- [ ] API URLs use environment variables
- [ ] CORS is properly configured
- [ ] Build scripts are working locally
- [ ] All tests are passing

## Deployment to Render

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Visit [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New +" → "Blueprint"
   - Select your repository
   - Click "Connect"

3. **Blueprint Deployment**
   - Render will detect `render.yaml`
   - Creates two services automatically:
     - `student-dashboard-api` (Backend)
     - `student-dashboard-frontend` (Frontend)
   - Wait 5-10 minutes for deployment

4. **Verify Deployment**
   - Backend: `https://student-dashboard-api.onrender.com/health`
   - Frontend: `https://student-dashboard-frontend.onrender.com`

### Method 2: Manual Deployment

#### Step 1: Deploy Backend API

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect repository

2. **Configure Service**
   ```
   Name: student-dashboard-api
   Environment: Node
   Build Command: npm install
   Start Command: npm run start-server
   Plan: Free
   ```

3. **Environment Variables**
   ```
   NODE_VERSION=18
   PORT=10000
   ```

#### Step 2: Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository

2. **Configure Site**
   ```
   Name: student-dashboard-frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

3. **Environment Variables**
   ```
   NODE_VERSION=18
   REACT_APP_API_URL=https://student-dashboard-api.onrender.com
   ```

## Post-Deployment

### 1. Test Functionality
- [ ] Website loads correctly
- [ ] API endpoints respond
- [ ] Students can be added/edited/deleted
- [ ] File uploads work
- [ ] Search and filtering work
- [ ] Responsive design functions

### 2. Monitor Performance
- Check Render dashboard for logs
- Monitor response times
- Watch for errors in browser console

### 3. Update Environment Variables
- Set production API URL in frontend
- Configure any additional settings

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `server.js` CORS configuration
   - Ensure frontend URL is in allowed origins

2. **API Not Found**
   - Verify backend service is running
   - Check API URL in environment variables

3. **Build Failures**
   - Check Node.js version (should be 18)
   - Verify all dependencies are installed

4. **Slow Loading**
   - First load after sleep takes 30-60 seconds (free tier)
   - Consider upgrading to paid plan for better performance

### Debug Commands

```bash
# Test local build
npm run build

# Test local server
npm run start-server

# Check health endpoint
curl http://localhost:3001/health

# View production build
npm install -g serve
serve -s build
```

## Environment Configuration

### Development
```
REACT_APP_API_URL=http://localhost:3001
```

### Production (Render)
```
REACT_APP_API_URL=https://student-dashboard-api.onrender.com
```

## Custom Domain (Optional)

1. **Add Domain in Render**
   - Go to site settings
   - Add custom domain
   - Update DNS records

2. **SSL Certificate**
   - Automatically provided by Render
   - Takes 5-10 minutes to activate

## Backup and Updates

### Database Backup
```bash
# Download current data
curl https://student-dashboard-api.onrender.com/students > backup.json
```

### Update Deployment
```bash
git add .
git commit -m "Update application"
git push origin main
```
- Render auto-deploys on git push

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Create issue in repository
- **Community**: Render Discord/Forum

---

**Happy Deploying! 🚀** 