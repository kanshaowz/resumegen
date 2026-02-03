/**
 * ResumeGen - Resume Generator
 * Real-time preview, multi-language support, PDF export
 */

// ========================================
// Translation Data
// ========================================

const translations = {
    en: {
        personal: 'Personal',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        personalInfo: 'Personal Information',
        fullName: 'Full Name',
        jobTitle: 'Job Title',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        summary: 'Professional Summary',
        workExperience: 'Work Experience',
        education: 'Education',
        add: 'Add',
        preview: 'Preview',
        downloadPDF: 'Download PDF',
        professionalSummary: 'Professional Summary',
        enterSkills: 'Enter skills (comma separated)',
        company: 'Company',
        position: 'Position',
        startDate: 'Start Date',
        endDate: 'End Date',
        description: 'Description',
        school: 'School/University',
        degree: 'Degree',
        fieldOfStudy: 'Field of Study',
        graduationDate: 'Graduation Date',
        remove: 'Remove'
    },
    zh: {
        personal: '个人信息',
        experience: '工作经历',
        education: '教育背景',
        skills: '技能',
        personalInfo: '个人信息',
        fullName: '姓名',
        jobTitle: '职位',
        email: '邮箱',
        phone: '电话',
        address: '地址',
        summary: '个人简介',
        workExperience: '工作经历',
        education: '教育背景',
        add: '添加',
        preview: '预览',
        downloadPDF: '下载 PDF',
        professionalSummary: '个人简介',
        enterSkills: '输入技能（用逗号分隔）',
        company: '公司',
        position: '职位',
        startDate: '开始日期',
        endDate: '结束日期',
        description: '描述',
        school: '学校/大学',
        degree: '学位',
        fieldOfStudy: '专业',
        graduationDate: '毕业日期',
        remove: '删除'
    },
    es: {
        personal: 'Personal',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        personalInfo: 'Información Personal',
        fullName: 'Nombre Completo',
        jobTitle: 'Título Profesional',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        address: 'Dirección',
        summary: 'Resumen Profesional',
        workExperience: 'Experiencia Laboral',
        education: 'Educación',
        add: 'Agregar',
        preview: 'Vista Previa',
        downloadPDF: 'Descargar PDF',
        professionalSummary: 'Resumen Profesional',
        enterSkills: 'Ingrese habilidades (separadas por comas)',
        company: 'Empresa',
        position: 'Posición',
        startDate: 'Fecha Inicio',
        endDate: 'Fecha Fin',
        description: 'Descripción',
        school: 'Escuela/Universidad',
        degree: 'Título',
        fieldOfStudy: 'Campo de Estudio',
        graduationDate: 'Fecha Graduación',
        remove: 'Eliminar'
    },
    ja: {
        personal: '個人情報',
        experience: '職務経歴',
        education: '学歴',
        skills: 'スキル',
        personalInfo: '個人情報',
        fullName: '氏名',
        jobTitle: '職種',
        email: 'メール',
        phone: '電話番号',
        address: '住所',
        summary: 'プロフィール',
        workExperience: '職務経歴',
        education: '学歴',
        add: '追加',
        preview: 'プレビュー',
        downloadPDF: 'PDFダウンロード',
        professionalSummary: 'プロフィール',
        enterSkills: 'スキルを入力（カンマ区切り）',
        company: '会社名',
        position: '役職',
        startDate: '開始日',
        endDate: '終了日',
        description: '業務内容',
        school: '学校名',
        degree: '学位',
        fieldOfStudy: '専攻',
        graduationDate: '卒業日',
        remove: '削除'
    },
    ko: {
        personal: '개인정보',
        experience: '경력',
        education: '학력',
        skills: '기술',
        personalInfo: '개인정보',
        fullName: '성명',
        jobTitle: '직책',
        email: '이메일',
        phone: '전화번호',
        address: '주소',
        summary: '전문 요약',
        workExperience: '업무 경력',
        education: '학력',
        add: '추가',
        preview: '미리보기',
        downloadPDF: 'PDF 다운로드',
        professionalSummary: '전문 요약',
        enterSkills: '기술 입력 (쉼표로 구분)',
        company: '회사',
        position: '직위',
        startDate: '시작일',
        endDate: '종료일',
        description: '설명',
        school: '학교/대학',
        degree: '학위',
        fieldOfStudy: '전공',
        graduationDate: '졸업일',
        remove: '삭제'
    }
};

// ========================================
// State Management
// ========================================

let currentLanguage = 'en';
let experienceCount = 0;
let educationCount = 0;

const resumeData = {
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    experience: [],
    education: [],
    skills: []
};

// ========================================
// DOM Elements
// ========================================

const elements = {
    languageSelect: document.getElementById('languageSelect'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    formSections: document.querySelectorAll('.form-section'),
    inputs: document.querySelectorAll('[data-field]'),
    addExperienceBtn: document.getElementById('addExperience'),
    addEducationBtn: document.getElementById('addEducation'),
    experienceList: document.getElementById('experienceList'),
    educationList: document.getElementById('educationList'),
    skillsInput: document.getElementById('skillsInput'),
    skillsPreview: document.getElementById('skillsPreview'),
    downloadBtn: document.getElementById('downloadBtn'),
    // Preview elements
    previewName: document.getElementById('previewName'),
    previewTitle: document.getElementById('previewTitle'),
    previewEmail: document.getElementById('previewEmail'),
    previewPhone: document.getElementById('previewPhone'),
    previewAddress: document.getElementById('previewAddress'),
    previewSummary: document.getElementById('previewSummary'),
    previewExperience: document.getElementById('previewExperience'),
    previewEducation: document.getElementById('previewEducation'),
    previewSkills: document.getElementById('previewSkills')
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    updateLanguage();
    updatePreview();
});

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Language selector
    elements.languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
        saveToLocalStorage();
    });

    // Tab switching
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchTab(section);
        });
    });

    // Input fields
    elements.inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const field = e.target.dataset.field;
            resumeData[field] = e.target.value;
            updatePreview();
            saveToLocalStorage();
        });
    });

    // Add experience
    elements.addExperienceBtn.addEventListener('click', addExperience);

    // Add education
    elements.addEducationBtn.addEventListener('click', addEducation);

    // Skills input
    elements.skillsInput.addEventListener('input', (e) => {
        const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
        resumeData.skills = skills;
        updateSkillsPreview();
        updatePreview();
        saveToLocalStorage();
    });

    // Download PDF
    elements.downloadBtn.addEventListener('click', downloadPDF);
}

// ========================================
// Tab Switching
// ========================================

function switchTab(section) {
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    elements.formSections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `${section}Section`);
    });
}

// ========================================
// Language Management
// ========================================

function updateLanguage() {
    const t = translations[currentLanguage];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-field]').forEach(input => {
        const key = input.dataset.field;
        if (key === 'name') input.placeholder = t.fullName || input.placeholder;
        else if (key === 'title') input.placeholder = t.jobTitle || input.placeholder;
        else if (key === 'email') input.placeholder = t.email || input.placeholder;
        else if (key === 'phone') input.placeholder = t.phone || input.placeholder;
        else if (key === 'address') input.placeholder = t.address || input.placeholder;
        else if (key === 'summary') input.placeholder = t.summary || input.placeholder;
    });

    elements.skillsInput.placeholder = t.enterSkills || '';

    // Update dynamic labels
    updateDynamicLabels();
}

function updateDynamicLabels() {
    const t = translations[currentLanguage];
    
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.querySelector('.item-number').textContent = `${t.experience || 'Experience'} #${index + 1}`;
    });

    document.querySelectorAll('.education-item').forEach((item, index) => {
        item.querySelector('.item-number').textContent = `${t.education || 'Education'} #${index + 1}`;
    });
}

// ========================================
// Experience Management
// ========================================

function addExperience(data = null) {
    experienceCount++;
    const t = translations[currentLanguage];
    const index = experienceCount;
    
    const experience = data || {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    };

    if (!data) {
        resumeData.experience.push(experience);
    }

    const item = document.createElement('div');
    item.className = 'experience-item';
    item.dataset.id = experience.id;
    item.innerHTML = `
        <div class="item-header">
            <span class="item-number">${t.experience} #${resumeData.experience.length}</span>
            <button class="btn-remove" onclick="removeExperience(${experience.id})">${t.remove}</button>
        </div>
        <div class="item-fields">
            <div class="form-group">
                <input type="text" placeholder="${t.company}" value="${experience.company}" data-exp-field="company">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.position}" value="${experience.position}" data-exp-field="position">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.startDate}" value="${experience.startDate}" data-exp-field="startDate">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.endDate}" value="${experience.endDate}" data-exp-field="endDate">
            </div>
            <div class="form-group full-width">
                <textarea placeholder="${t.description}" rows="2" data-exp-field="description">${experience.description}</textarea>
            </div>
        </div>
    `;

    item.querySelectorAll('[data-exp-field]').forEach(field => {
        field.addEventListener('input', (e) => {
            const expField = e.target.dataset.expField;
            const exp = resumeData.experience.find(exp => exp.id === experience.id);
            if (exp) {
                exp[expField] = e.target.value;
                updatePreview();
                saveToLocalStorage();
            }
        });
    });

    elements.experienceList.appendChild(item);
    updateDynamicLabels();
}

function removeExperience(id) {
    resumeData.experience = resumeData.experience.filter(exp => exp.id !== id);
    const item = document.querySelector(`.experience-item[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
    updateDynamicLabels();
    updatePreview();
    saveToLocalStorage();
}

// ========================================
// Education Management
// ========================================

function addEducation(data = null) {
    educationCount++;
    const t = translations[currentLanguage];
    const index = educationCount;
    
    const education = data || {
        id: Date.now(),
        school: '',
        degree: '',
        fieldOfStudy: '',
        graduationDate: ''
    };

    if (!data) {
        resumeData.education.push(education);
    }

    const item = document.createElement('div');
    item.className = 'education-item';
    item.dataset.id = education.id;
    item.innerHTML = `
        <div class="item-header">
            <span class="item-number">${t.education} #${resumeData.education.length}</span>
            <button class="btn-remove" onclick="removeEducation(${education.id})">${t.remove}</button>
        </div>
        <div class="item-fields">
            <div class="form-group">
                <input type="text" placeholder="${t.school}" value="${education.school}" data-edu-field="school">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.degree}" value="${education.degree}" data-edu-field="degree">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.fieldOfStudy}" value="${education.fieldOfStudy}" data-edu-field="fieldOfStudy">
            </div>
            <div class="form-group">
                <input type="text" placeholder="${t.graduationDate}" value="${education.graduationDate}" data-edu-field="graduationDate">
            </div>
        </div>
    `;

    item.querySelectorAll('[data-edu-field]').forEach(field => {
        field.addEventListener('input', (e) => {
            const eduField = e.target.dataset.eduField;
            const edu = resumeData.education.find(edu => edu.id === education.id);
            if (edu) {
                edu[eduField] = e.target.value;
                updatePreview();
                saveToLocalStorage();
            }
        });
    });

    elements.educationList.appendChild(item);
    updateDynamicLabels();
}

function removeEducation(id) {
    resumeData.education = resumeData.education.filter(edu => edu.id !== id);
    const item = document.querySelector(`.education-item[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
    updateDynamicLabels();
    updatePreview();
    saveToLocalStorage();
}

// ========================================
// Skills Preview
// ========================================

function updateSkillsPreview() {
    elements.skillsPreview.innerHTML = resumeData.skills
        .map(skill => `<span class="skill-tag">${skill}</span>`)
        .join('');
}

// ========================================
// Preview Update
// ========================================

function updatePreview() {
    // Personal info
    elements.previewName.textContent = resumeData.name || 'Your Name';
    elements.previewTitle.textContent = resumeData.title || 'Job Title';
    elements.previewEmail.textContent = resumeData.email || 'email@example.com';
    elements.previewPhone.textContent = resumeData.phone || '+1 234 567 890';
    elements.previewAddress.textContent = resumeData.address || 'City, Country';
    elements.previewSummary.textContent = resumeData.summary || 'Your professional summary will appear here...';

    // Experience
    const experienceSection = document.getElementById('experiencePreviewSection');
    if (resumeData.experience.length > 0) {
        experienceSection.style.display = 'block';
        elements.previewExperience.innerHTML = resumeData.experience.map(exp => `
            <div class="experience-entry">
                <div class="entry-header">
                    <span class="entry-title">${exp.position || 'Position'}</span>
                    <span class="entry-date">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</span>
                </div>
                <div class="entry-subtitle">${exp.company || 'Company'}</div>
                <div class="entry-description">${exp.description || ''}</div>
            </div>
        `).join('');
    } else {
        experienceSection.style.display = 'none';
    }

    // Education
    const educationSection = document.getElementById('educationPreviewSection');
    if (resumeData.education.length > 0) {
        educationSection.style.display = 'block';
        elements.previewEducation.innerHTML = resumeData.education.map(edu => `
            <div class="education-entry">
                <div class="entry-header">
                    <span class="entry-title">${edu.school || 'School/University'}</span>
                    <span class="entry-date">${edu.graduationDate || 'Date'}</span>
                </div>
                <div class="entry-subtitle">${edu.degree || 'Degree'}${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}</div>
            </div>
        `).join('');
    } else {
        educationSection.style.display = 'none';
    }

    // Skills
    const skillsSection = document.getElementById('skillsPreviewSection');
    if (resumeData.skills.length > 0) {
        skillsSection.style.display = 'block';
        elements.previewSkills.innerHTML = resumeData.skills
            .map(skill => `<span class="skill-pill">${skill}</span>`)
            .join('');
    } else {
        skillsSection.style.display = 'none';
    }
}

// ========================================
// PDF Download
// ========================================

function downloadPDF() {
    const resume = document.getElementById('resumePreview');
    const t = translations[currentLanguage];
    
    const opt = {
        margin: 0,
        filename: `Resume_${resumeData.name || 'MyResume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };

    // Show loading state
    const btn = elements.downloadBtn;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span><span>Loading...</span>';
    btn.disabled = true;

    html2pdf().set(opt).from(resume).save().then(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error('PDF generation failed:', err);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('PDF generation failed. Please try again.');
    });
}

// ========================================
// Local Storage
// ========================================

function saveToLocalStorage() {
    localStorage.setItem('resumeGenData', JSON.stringify({
        language: currentLanguage,
        data: resumeData
    }));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('resumeGenData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.language) {
                currentLanguage = parsed.language;
                elements.languageSelect.value = currentLanguage;
            }
            if (parsed.data) {
                Object.assign(resumeData, parsed.data);
                
                // Restore form values
                document.getElementById('fullName').value = resumeData.name || '';
                document.getElementById('jobTitle').value = resumeData.title || '';
                document.getElementById('email').value = resumeData.email || '';
                document.getElementById('phone').value = resumeData.phone || '';
                document.getElementById('address').value = resumeData.address || '';
                document.getElementById('summary').value = resumeData.summary || '';
                
                // Restore skills
                elements.skillsInput.value = resumeData.skills.join(', ');
                updateSkillsPreview();
                
                // Restore experience
                resumeData.experience.forEach(exp => {
                    addExperience(exp);
                });
                
                // Restore education
                resumeData.education.forEach(edu => {
                    addEducation(edu);
                });
            }
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }
}

// Expose functions to global scope for onclick handlers
window.removeExperience = removeExperience;
window.removeEducation = removeEducation;
