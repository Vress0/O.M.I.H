import React, { useState } from 'react';
import apiService from '../services/api';
import './DoctorCard.css';

const DoctorCard = ({ doctor, onSelect, isSelected = false, showActions = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(doctor.is_favorite || false);

  // 獲取專業等級顯示
  const getExperienceLevel = (years) => {
    if (years >= 20) return { level: 'senior', text: '資深專家', color: '#dc2626' };
    if (years >= 10) return { level: 'experienced', text: '經驗豐富', color: '#ea580c' };
    if (years >= 5) return { level: 'qualified', text: '專業資格', color: '#ca8a04' };
    return { level: 'junior', text: '執業醫師', color: '#16a34a' };
  };

  // 獲取評分星星
  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (halfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  // 切換收藏狀態
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const response = await apiService.toggleDoctorFavorite(doctor.id);
      if (response.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('切換收藏狀態失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 預約醫師
  const handleBooking = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const response = await apiService.bookDoctor(doctor.id);
      if (response.success) {
        alert('預約成功！我們將盡快與您聯繫確認預約時間。');
      } else {
        throw new Error(response.message || '預約失敗');
      }
    } catch (error) {
      console.error('預約失敗:', error);
      alert('預約失敗，請稍後再試或直接聯繫診所。');
    } finally {
      setIsLoading(false);
    }
  };

  // 查看醫師詳情
  const viewDetails = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const response = await apiService.getDoctorDetails(doctor.id);
      if (response.success && response.data) {
        // 這裡可以開啟醫師詳情頁面或模態框
        console.log('醫師詳情:', response.data);
        setIsExpanded(!isExpanded);
      }
    } catch (error) {
      console.error('獲取醫師詳情失敗:', error);
      setIsExpanded(!isExpanded);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理卡片點擊
  const handleCardClick = () => {
    if (onSelect && showActions) {
      onSelect(doctor);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const experienceInfo = getExperienceLevel(doctor.experience_years || 0);
  const matchScore = doctor.match_score || doctor.similarity_score || 0;

  return (
    <div 
      className={`doctor-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={handleCardClick}
    >
      {/* 匹配度指示器 */}
      {matchScore > 0 && (
        <div className="match-indicator">
          <div className="match-score">匹配度 {Math.round(matchScore * 100)}%</div>
          <div className="match-bar">
            <div 
              className="match-fill" 
              style={{ width: `${matchScore * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 醫師基本資訊 */}
      <div className="doctor-header">
        <div className="doctor-avatar">
          {doctor.photo ? (
            <img src={doctor.photo} alt={doctor.name} />
          ) : (
            <div className="avatar-placeholder">
              {doctor.name ? doctor.name.charAt(0) : '醫'}
            </div>
          )}
          
          {/* 線上狀態指示器 */}
          {doctor.is_online && (
            <div className="online-indicator" title="線上諮詢">🟢</div>
          )}
        </div>

        <div className="doctor-info">
          <div className="doctor-name-row">
            <h3 className="doctor-name">{doctor.name || '未知醫師'}</h3>
            
            {showActions && (
              <button
                onClick={toggleFavorite}
                disabled={isLoading}
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                title={isFavorite ? '取消收藏' : '加入收藏'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          <div className="doctor-title">
            <span className="department">{doctor.department || '中醫科'}</span>
            <span className="separator">•</span>
            <span 
              className="experience-badge"
              style={{ color: experienceInfo.color }}
            >
              {experienceInfo.text}
            </span>
          </div>

          <div className="doctor-clinic">
            <span className="clinic-icon">🏥</span>
            <span className="clinic-name">{doctor.clinic || doctor.hospital || '診所資訊待更新'}</span>
          </div>

          {/* 評分和評論 */}
          <div className="doctor-rating">
            <div className="rating-stars">
              {getRatingStars(doctor.rating || 4.5)}
            </div>
            <span className="rating-score">{(doctor.rating || 4.5).toFixed(1)}</span>
            <span className="rating-count">({doctor.review_count || 0} 評論)</span>
          </div>
        </div>
      </div>

      {/* 專長領域 */}
      <div className="doctor-specialties">
        <div className="specialties-title">專長領域：</div>
        <div className="specialties-tags">
          {doctor.specialties && doctor.specialties.length > 0 ? (
            doctor.specialties.slice(0, isExpanded ? doctor.specialties.length : 3).map((specialty, index) => (
              <span key={index} className="specialty-tag">
                {specialty}
              </span>
            ))
          ) : (
            <span className="specialty-tag">中醫內科</span>
          )}
          
          {!isExpanded && doctor.specialties && doctor.specialties.length > 3 && (
            <span className="more-specialties">
              +{doctor.specialties.length - 3} 更多
            </span>
          )}
        </div>
      </div>

      {/* 展開內容 */}
      {isExpanded && (
        <div className="doctor-details">
          {/* 醫師簡介 */}
          {doctor.description && (
            <div className="doctor-description">
              <h4>醫師簡介</h4>
              <p>{doctor.description}</p>
            </div>
          )}

          {/* 看診時間 */}
          {doctor.schedule && (
            <div className="doctor-schedule">
              <h4>看診時間</h4>
              <div className="schedule-grid">
                {Object.entries(doctor.schedule).map(([day, times]) => (
                  <div key={day} className="schedule-item">
                    <span className="schedule-day">{day}</span>
                    <span className="schedule-times">
                      {Array.isArray(times) ? times.join(', ') : times}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 聯繫資訊 */}
          <div className="doctor-contact">
            <h4>聯繫方式</h4>
            <div className="contact-info">
              {doctor.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">{doctor.phone}</span>
                </div>
              )}
              
              {doctor.address && (
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">{doctor.address}</span>
                </div>
              )}

              {doctor.email && (
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span className="contact-text">{doctor.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* 最近評論 */}
          {doctor.recent_reviews && doctor.recent_reviews.length > 0 && (
            <div className="doctor-reviews">
              <h4>患者評價</h4>
              <div className="reviews-list">
                {doctor.recent_reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">{review.patient_name || '匿名患者'}</div>
                      <div className="review-rating">
                        {getRatingStars(review.rating)}
                      </div>
                    </div>
                    <div className="review-content">{review.content}</div>
                    <div className="review-date">{review.date || '最近'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 操作按鈕 */}
      {showActions && (
        <div className="doctor-actions">
          <button
            onClick={viewDetails}
            disabled={isLoading}
            className="detail-btn"
          >
            {isLoading ? '載入中...' : (isExpanded ? '收起詳情' : '查看詳情')}
          </button>

          {doctor.accept_online_consultation && (
            <button
              onClick={() => window.open(`/chat?doctor=${doctor.id}`, '_blank')}
              className="consult-btn online"
              title="線上諮詢"
            >
              💬 線上諮詢
            </button>
          )}

          <button
            onClick={handleBooking}
            disabled={isLoading}
            className="booking-btn"
          >
            {isLoading ? '處理中...' : '📅 立即預約'}
          </button>
        </div>
      )}

      {/* 載入覆層 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳</div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;