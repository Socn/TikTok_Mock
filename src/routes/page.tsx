import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useEffect } from 'react';

function Index() {
  /* Redirect to /jingxuan if 'recommend' query param is not '1' */
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isRecommendPage = query.get('recommend');
  const navigate = useNavigate();
  useEffect(() => {
    if (isRecommendPage !== '1') {
      navigate('/jingxuan', { replace: true });
    }
  }, [isRecommendPage, navigate]);

  if (isRecommendPage !== '1') {
    return <></>; // Prevent rendering before redirect
  }
  return (
    <div className="recommend-page">
      <h1>Welcome to the Recommend Page!</h1>
      <p>This page is tailored just for you.</p>
    </div>
  );
}

export default Index;
