'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SaalikForm = ({ level = 1, existingEntry = null, onSubmit }) => {
  const { apiCall } = useAuth();
  const [formData, setFormData] = useState({});
  const [formStructure, setFormStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState('en');

  // Form structure based on level
  const getFormStructure = (level) => {
    const baseStructure = [
      {
        id: 'fajr_prayer',
        type: 'checkbox',
        label: { en: 'Fajr Prayer', ur: 'فجر کی نماز' },
        required: true
      },
      {
        id: 'zuhr_prayer',
        type: 'checkbox',
        label: { en: 'Zuhr Prayer', ur: 'ظہر کی نماز' },
        required: true
      },
      {
        id: 'asr_prayer',
        type: 'checkbox',
        label: { en: 'Asr Prayer', ur: 'عصر کی نماز' },
        required: true
      },
      {
        id: 'maghrib_prayer',
        type: 'checkbox',
        label: { en: 'Maghrib Prayer', ur: 'مغرب کی نماز' },
        required: true
      },
      {
        id: 'isha_prayer',
        type: 'checkbox',
        label: { en: 'Isha Prayer', ur: 'عشاء کی نماز' },
        required: true
      }
    ];

    if (level >= 1) {
      baseStructure.push(
        {
          id: 'quran_recitation',
          type: 'number',
          label: { en: 'Quran Recitation (Pages)', ur: 'قرآن کی تلاوت (صفحات)' },
          min: 0,
          max: 20,
          required: true
        },
        {
          id: 'dhikr_tasbih',
          type: 'number',
          label: { en: 'Dhikr/Tasbih (Count)', ur: 'ذکر/تسبیح (تعداد)' },
          min: 0,
          max: 1000,
          required: true
        }
      );
    }

    if (level >= 2) {
      baseStructure.push(
        {
          id: 'tahajjud_prayer',
          type: 'checkbox',
          label: { en: 'Tahajjud Prayer', ur: 'تہجد کی نماز' },
          required: false
        },
        {
          id: 'duha_prayer',
          type: 'checkbox',
          label: { en: 'Duha Prayer', ur: 'چاشت کی نماز' },
          required: false
        },
        {
          id: 'istighfar_count',
          type: 'number',
          label: { en: 'Istighfar Count', ur: 'استغفار کی تعداد' },
          min: 0,
          max: 500,
          required: true
        }
      );
    }

    if (level >= 3) {
      baseStructure.push(
        {
          id: 'quran_memorization',
          type: 'text',
          label: { en: 'Quran Memorization (Verses)', ur: 'قرآن حفظ (آیات)' },
          required: false
        },
        {
          id: 'islamic_study',
          type: 'number',
          label: { en: 'Islamic Study (Minutes)', ur: 'اسلامی مطالعہ (منٹ)' },
          min: 0,
          max: 180,
          required: true
        },
        {
          id: 'charity_amount',
          type: 'number',
          label: { en: 'Charity/Sadaqah (Amount)', ur: 'خیرات/صدقہ (رقم)' },
          min: 0,
          required: false
        }
      );
    }

    if (level >= 4) {
      baseStructure.push(
        {
          id: 'fasting_voluntary',
          type: 'checkbox',
          label: { en: 'Voluntary Fasting', ur: 'نفلی روزہ' },
          required: false
        },
        {
          id: 'dua_special',
          type: 'textarea',
          label: { en: 'Special Duas/Supplications', ur: 'خصوصی دعائیں' },
          required: false
        },
        {
          id: 'spiritual_reflection',
          type: 'textarea',
          label: { en: 'Spiritual Reflection', ur: 'روحانی غور و فکر' },
          required: false
        }
      );
    }

    return baseStructure;
  };

  useEffect(() => {
    const structure = getFormStructure(level);
    setFormStructure(structure);
    
    // Initialize form data
    const initialData = {};
    structure.forEach(field => {
      if (existingEntry && existingEntry[field.id] !== undefined) {
        initialData[field.id] = existingEntry[field.id];
      } else {
        initialData[field.id] = field.type === 'checkbox' ? false : 
                               field.type === 'number' ? 0 : '';
      }
    });
    setFormData(initialData);
    setLoading(false);
  }, [level, existingEntry]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // Form submitted successfully
        alert(language === 'en' ? 'Entry saved successfully!' : 'اندراج کامیابی سے محفوظ ہو گیا!');
      } else {
        alert(language === 'en' ? 'Error saving entry' : 'اندراج محفوظ کرنے میں خرابی');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(language === 'en' ? 'Error saving entry' : 'اندراج محفوظ کرنے میں خرابی');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const label = field.label[language];
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center">
            <input
              id={field.id}
              type="checkbox"
              checked={value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className={`ml-2 block text-sm text-gray-900 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case 'number':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className={`block text-sm font-medium text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={field.id}
              type="number"
              min={field.min || 0}
              max={field.max || undefined}
              value={value}
              onChange={(e) => handleInputChange(field.id, parseInt(e.target.value) || 0)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${language === 'ur' ? 'text-right' : ''}`}
              required={field.required}
            />
          </div>
        );

      case 'text':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className={`block text-sm font-medium text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={field.id}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${language === 'ur' ? 'text-right' : ''}`}
              required={field.required}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className={`block text-sm font-medium text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.id}
              rows={3}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${language === 'ur' ? 'text-right' : ''}`}
              required={field.required}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold text-gray-900 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {language === 'en' ? `Daily Entry - Level ${level}` : `روزانہ اندراج - لیول ${level}`}
        </h2>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {language === 'en' ? 'اردو' : 'English'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formStructure.map(field => (
            <div key={field.id}>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => window.history.back()}
          >
            {language === 'en' ? 'Cancel' : 'منسوخ'}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ur' ? 'font-urdu' : ''}`}
          >
            {submitting 
              ? (language === 'en' ? 'Saving...' : 'محفوظ ہو رہا ہے...')
              : (language === 'en' ? 'Save Entry' : 'اندراج محفوظ کریں')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaalikForm;