/**
 * ResumeGen Pro - Professional Resume Builder
 * Complete Application Logic
 */

// ========================================
// Templates Configuration
// ========================================

const templates = [
    {
        id: 'modern',
        name: '现代专业',
        category: 'modern',
        description: '简洁现代的布局，适合各行各业',
        thumbnail: 'modern',
        popular: true
    },
    {
        id: 'classic',
        name: '经典优雅',
        category: 'classic',
        description: '传统正式的设计，适合保守行业',
        thumbnail: 'classic'
    },
    {
        id: 'minimal',
        name: '极简风格',
        category: 'minimal',
        description: '清爽简约，突出内容本身',
        thumbnail: 'minimal'
    },
    {
        id: 'creative',
        name: '创意侧边栏',
        category: 'creative',
        description: '独特的侧边栏设计，视觉突出',
        thumbnail: 'creative'
    },
    {
        id: 'twocolumn',
        name: '双栏布局',
        category: 'modern',
        description: '高效利用空间，信息密度高',
        thumbnail: 'twocolumn'
    },
    {
        id: 'executive',
        name: '高管风格',
        category: 'classic',
        description: '大气稳重，适合管理岗位',
        thumbnail: 'executive',
        popular: true
    },
    {
        id: 'compact',
        name: '紧凑实用',
        category: 'minimal',
        description: '一页纸设计，信息集中',
        thumbnail: 'compact'
    },
    {
        id: 'tech',
        name: '科技风格',
        category: 'creative',
        description: '现代科技感，适合IT行业',
        thumbnail: 'tech'
    }
];

// ========================================
// Color Themes
// ========================================

const themes = {
    navy: { primary: '#1e3a5f', secondary: '#2c5282', light: '#ebf8ff' },
    forest: { primary: '#2d5a3d', secondary: '#276749', light: '#f0fff4' },
    burgundy: { primary: '#722f37', secondary: '#9b2c2c', light: '#fff5f5' },
    slate: { primary: '#475569', secondary: '#64748b', light: '#f8fafc' },
    indigo: { primary: '#3730a3', secondary: '#4f46e5', light: '#eef2ff' },
    rose: { primary: '#be123c', secondary: '#e11d48', light: '#fff1f2' },
    emerald: { primary: '#047857', secondary: '#059669', light: '#ecfdf5' },
    amber: { primary: '#b45309', secondary: '#d97706', light: '#fffbeb' }
};

// ========================================
// State Management
// ========================================

let currentState = {
    currentStep: 1,
    selectedTemplate: 'modern',
    selectedTheme: 'navy',
    zoom: 1,
    data: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: ''
    }
};

let experienceCount = 0;
let educationCount = 0;
let languageCount = 0;
let aiSuggestionCache = null;

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderTemplates();
    setupEventListeners();
    updatePreview();
    applyTheme(currentState.selectedTheme);
});

function setupEventListeners() {
    // Template category filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTemplates(btn.dataset.category);
        });
    });

    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyTheme(btn.dataset.theme);
        });
    });

    // Form inputs
    document.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', (e) => {
            const field = e.target.dataset.field;
            currentState.data[field] = e.target.value;
            updatePreview();
            saveToLocalStorage();
        });
    });

    // Skills input
    const skillsInput = document.getElementById('skillsInput');
    if (skillsInput) {
        skillsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = skillsInput.value.trim();
                if (value) {
                    addSkill(value.replace(',', ''));
                    skillsInput.value = '';
                }
            }
        });

        skillsInput.addEventListener('blur', () => {
            const value = skillsInput.value.trim();
            if (value) {
                value.split(',').forEach(skill => {
                    const trimmed = skill.trim();
                    if (trimmed) addSkill(trimmed);
                });
                skillsInput.value = '';
            }
        });
    }

    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ========================================
// Navigation
// ========================================

function showTemplateSelection() {
    document.getElementById('templateModal').classList.add('active');
}

function closeModal() {
    document.getElementById('templateModal').classList.remove('active');
}

function selectTemplate(templateId) {
    currentState.selectedTemplate = templateId;
    const template = templates.find(t => t.id === templateId);
    document.getElementById('currentTemplateName').textContent = template.name;
    
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.template === templateId);
    });
    
    updatePreview();
    saveToLocalStorage();
    
    // If on landing page, switch to app
    if (!document.getElementById('landingPage').classList.contains('hidden')) {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }
    
    closeModal();
    showToast(`已选择模板：${template.name}`);
}

function backToLanding() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
}

function nextStep() {
    if (currentState.currentStep < 4) {
        document.getElementById(`step${currentState.currentStep}`).classList.remove('active');
        currentState.currentStep++;
        document.getElementById(`step${currentState.currentStep}`).classList.add('active');
        updateStepIndicator();
    }
}

function prevStep() {
    if (currentState.currentStep > 1) {
        document.getElementById(`step${currentState.currentStep}`).classList.remove('active');
        currentState.currentStep--;
        document.getElementById(`step${currentState.currentStep}`).classList.add('active');
        updateStepIndicator();
    }
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentState.currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentState.currentStep) {
            step.classList.add('completed');
        }
    });
}

function finishAndExport() {
    showExportModal();
}

// ========================================
// Template Rendering
// ========================================

function renderTemplates(category = 'all') {
    const grid = document.getElementById('templatesGrid');
    const filtered = category === 'all' 
        ? templates 
        : templates.filter(t => t.category === category);
    
    grid.innerHTML = filtered.map(template => `
        <div class="template-card ${currentState.selectedTemplate === template.id ? 'selected' : ''}" 
             data-template="${template.id}"
             onclick="selectTemplate('${template.id}')">
            <div class="template-preview">
                <div class="template-mini template-${template.thumbnail}">
                    <!-- Mini preview content -->
                </div>
            </div>
            <div class="template-info">
                <h3>${template.name}</h3>
                <p>${template.description}</p>
            </div>
            ${template.popular ? '<span class="template-badge">热门</span>' : ''}
        </div>
    `).join('');
}

function applyTheme(themeId) {
    currentState.selectedTheme = themeId;
    const theme = themes[themeId];
    
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-light', theme.light);
    
    updatePreview();
    saveToLocalStorage();
}

// ========================================
// Experience Management
// ========================================

function addExperience(data = null) {
    experienceCount++;
    const exp = data || {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    };

    if (!data) {
        currentState.data.experience.push(exp);
    }

    const item = document.createElement('div');
    item.className = 'experience-item';
    item.dataset.id = exp.id;
    item.innerHTML = `
        <div class="item-header">
            <span class="item-number">工作经历 #${currentState.data.experience.length}</span>
            <button class="btn-remove" onclick="removeExperience(${exp.id})" title="删除">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="item-fields">
            <div class="form-group">
                <input type="text" placeholder="公司名称" value="${exp.company}" data-exp-field="company">
            </div>
            <div class="form-group">
                <input type="text" placeholder="职位" value="${exp.position}" data-exp-field="position">
            </div>
            <div class="form-group">
                <input type="text" placeholder="开始时间 (例如: 2020.01)" value="${exp.startDate}" data-exp-field="startDate">
            </div>
            <div class="form-group">
                <input type="text" placeholder="结束时间 (例如: 2023.12)" value="${exp.endDate}" data-exp-field="endDate">
            </div>
            <div class="form-group full-width ai-assist">
                <textarea placeholder="工作描述（建议使用STAR法则描述成就）" rows="3" data-exp-field="description">${exp.description}</textarea>
                <button class="ai-btn" onclick="optimizeExperience(${exp.id})" title="AI优化">
                    <i class="fas fa-sparkles"></i>
                </button>
            </div>
        </div>
    `;

    // Add input listeners
    item.querySelectorAll('[data-exp-field]').forEach(field => {
        field.addEventListener('input', (e) => {
            const expField = e.target.dataset.expField;
            const experience = currentState.data.experience.find(e => e.id === exp.id);
            if (experience) {
                experience[expField] = e.target.value;
                updatePreview();
                saveToLocalStorage();
            }
        });
    });

    document.getElementById('experienceList').appendChild(item);
    updateExperienceNumbers();
}

function removeExperience(id) {
    currentState.data.experience = currentState.data.experience.filter(e => e.id !== id);
    const item = document.querySelector(`.experience-item[data-id="${id}"]`);
    if (item) item.remove();
    updateExperienceNumbers();
    updatePreview();
    saveToLocalStorage();
}

function updateExperienceNumbers() {
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.querySelector('.item-number').textContent = `工作经历 #${index + 1}`;
    });
}

// ========================================
// Education Management
// ========================================

function addEducation(data = null) {
    educationCount++;
    const edu = data || {
        id: Date.now(),
        school: '',
        degree: '',
        field: '',
        date: ''
    };

    if (!data) {
        currentState.data.education.push(edu);
    }

    const item = document.createElement('div');
    item.className = 'education-item';
    item.dataset.id = edu.id;
    item.innerHTML = `
        <div class="item-header">
            <span class="item-number">教育经历 #${currentState.data.education.length}</span>
            <button class="btn-remove" onclick="removeEducation(${edu.id})" title="删除">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="item-fields">
            <div class="form-group">
                <input type="text" placeholder="学校/大学" value="${edu.school}" data-edu-field="school">
            </div>
            <div class="form-group">
                <input type="text" placeholder="学位" value="${edu.degree}" data-edu-field="degree">
            </div>
            <div class="form-group">
                <input type="text" placeholder="专业" value="${edu.field}" data-edu-field="field">
            </div>
            <div class="form-group">
                <input type="text" placeholder="毕业时间" value="${edu.date}" data-edu-field="date">
            </div>
        </div>
    `;

    item.querySelectorAll('[data-edu-field]').forEach(field => {
        field.addEventListener('input', (e) => {
            const eduField = e.target.dataset.eduField;
            const education = currentState.data.education.find(e => e.id === edu.id);
            if (education) {
                education[eduField] = e.target.value;
                updatePreview();
                saveToLocalStorage();
            }
        });
    });

    document.getElementById('educationList').appendChild(item);
    updateEducationNumbers();
}

function removeEducation(id) {
    currentState.data.education = currentState.data.education.filter(e => e.id !== id);
    const item = document.querySelector(`.education-item[data-id="${id}"]`);
    if (item) item.remove();
    updateEducationNumbers();
    updatePreview();
    saveToLocalStorage();
}

function updateEducationNumbers() {
    document.querySelectorAll('.education-item').forEach((item, index) => {
        item.querySelector('.item-number').textContent = `教育经历 #${index + 1}`;
    });
}

// ========================================
// Skills Management
// ========================================

function addSkill(skill) {
    if (!skill || currentState.data.skills.includes(skill)) return;
    
    currentState.data.skills.push(skill);
    renderSkills();
    updatePreview();
    saveToLocalStorage();
}

function removeSkill(skill) {
    currentState.data.skills = currentState.data.skills.filter(s => s !== skill);
    renderSkills();
    updatePreview();
    saveToLocalStorage();
}

function renderSkills() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = currentState.data.skills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <i class="fas fa-times remove" onclick="removeSkill('${skill}')"></i>
        </span>
    `).join('');
}

// ========================================
// Languages Management
// ========================================

function addLanguage(data = null) {
    languageCount++;
    const lang = data || {
        id: Date.now(),
        name: '',
        level: ''
    };

    if (!data) {
        currentState.data.languages.push(lang);
    }

    const item = document.createElement('div');
    item.className = 'language-item';
    item.dataset.id = lang.id;
    item.innerHTML = `
        <div class="form-group">
            <input type="text" placeholder="语言（例如：英语）" value="${lang.name}" data-lang-field="name">
        </div>
        <div class="form-group">
            <select data-lang-field="level">
                <option value="">选择水平</option>
                <option value="母语" ${lang.level === '母语' ? 'selected' : ''}>母语</option>
                <option value="流利" ${lang.level === '流利' ? 'selected' : ''}>流利</option>
                <option value="熟练" ${lang.level === '熟练' ? 'selected' : ''}>熟练</option>
                <option value="中级" ${lang.level === '中级' ? 'selected' : ''}>中级</option>
                <option value="初级" ${lang.level === '初级' ? 'selected' : ''}>初级</option>
            </select>
        </div>
        <button class="btn-remove" onclick="removeLanguage(${lang.id})" title="删除">
            <i class="fas fa-times"></i>
        </button>
    `;

    item.querySelectorAll('[data-lang-field]').forEach(field => {
        field.addEventListener('input', (e) => {
            const langField = e.target.dataset.langField;
            const language = currentState.data.languages.find(l => l.id === lang.id);
            if (language) {
                language[langField] = e.target.value;
                updatePreview();
                saveToLocalStorage();
            }
        });
    });

    document.getElementById('languagesList').appendChild(item);
}

function removeLanguage(id) {
    currentState.data.languages = currentState.data.languages.filter(l => l.id !== id);
    const item = document.querySelector(`.language-item[data-id="${id}"]`);
    if (item) item.remove();
    updatePreview();
    saveToLocalStorage();
}

// ========================================
// AI Features
// ========================================

function generateAISummary() {
    const name = currentState.data.name || '求职者';
    const title = currentState.data.title || '专业人士';
    
    const suggestions = [
        `具有5年以上${title}经验的专业人士，擅长团队协作和项目管理。成功主导过多个大型项目，具备出色的沟通和领导能力。致力于在快节奏的环境中创造价值，推动业务增长。`,
        `资深${title}，在行业内拥有丰富的实战经验。精通现代技术栈，善于解决复杂问题。具备跨部门协作能力，能够有效推动项目落地。`,
        `充满激情的${title}，专注于提供高质量的解决方案。具备优秀的分析能力和创新思维，善于在压力下保持高效工作。期待在新的平台上发挥所长。`
    ];
    
    showAIModal('个人简介建议', suggestions);
}

function suggestSkills() {
    const title = currentState.data.title || '';
    const suggestions = {
        '产品经理': ['产品规划', '用户研究', '数据分析', '项目管理', 'Axure', '用户故事', 'A/B测试', '敏捷开发'],
        '工程师': ['JavaScript', 'Python', 'React', 'Node.js', 'Docker', 'Git', '微服务', 'CI/CD'],
        '设计': ['UI/UX', 'Figma', 'Sketch', 'Adobe XD', '用户研究', '设计系统', '原型设计', '视觉设计'],
        '运营': ['数据分析', '用户增长', '内容运营', '社群运营', '活动策划', 'SEO/SEM', '新媒体', '数据运营'],
        '销售': ['客户开发', '商务谈判', 'CRM', '销售策略', '客户关系', '市场分析', '演讲展示', '成交闭环']
    };
    
    let matchedSkills = ['团队协作', '沟通能力', '问题解决', '时间管理', '学习能力'];
    
    for (const [key, value] of Object.entries(suggestions)) {
        if (title.includes(key) || key.includes(title)) {
            matchedSkills = [...matchedSkills, ...value];
            break;
        }
    }
    
    const aiContent = document.getElementById('aiContent');
    aiContent.innerHTML = `
        <div class="suggestions">
            <p style="margin-bottom: 1rem; color: var(--gray-600);">根据您的职位"${title || '专业人士'}"，我们推荐以下技能：</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${matchedSkills.map(skill => `
                    <span class="skill-chip" onclick="addSkill('${skill}'); closeAIModal();" style="cursor: pointer;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('aiModal').classList.add('active');
}

function optimizeExperience(expId) {
    const experience = currentState.data.experience.find(e => e.id === expId);
    if (!experience) return;
    
    const suggestions = [
        `• 负责${experience.position || '核心'}模块的开发，优化系统性能30%，提升用户体验\n• 主导跨部门协作，带领5人团队完成项目交付，获得客户好评\n• 设计并实施新的工作流程，使团队效率提升25%`,
        `• 管理年度预算500万，成功控制成本在预算范围内，节省15%开支\n• 建立数据分析体系，为业务决策提供支持，推动业绩增长20%\n• 开发并培训团队成员，团队整体能力提升显著`,
        `• 独立完成产品从0到1的设计和上线，获得10万+用户\n• 优化用户转化漏斗，转化率提升40%，月活增长50%\n• 建立用户反馈机制，产品NPS评分提升至75分`
    ];
    
    aiSuggestionCache = { type: 'experience', id: expId };
    showAIModal('工作描述优化建议', suggestions);
}

function showAIModal(title, suggestions) {
    const aiContent = document.getElementById('aiContent');
    aiContent.innerHTML = `
        <div class="suggestions">
            ${suggestions.map((s, i) => `
                <div class="suggestion-item" onclick="selectSuggestion(this, ${i})" data-index="${i}">
                    ${s.replace(/\n/g, '<br>')}
                </div>
            `).join('')}
        </div>
    `;
    
    document.querySelector('.ai-header h2').textContent = title;
    document.getElementById('aiModal').classList.add('active');
}

function selectSuggestion(el, index) {
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.classList.remove('selected');
    });
    el.classList.add('selected');
    aiSuggestionCache.selectedIndex = index;
    aiSuggestionCache.content = el.innerHTML.replace(/<br>/g, '\n');
}

function closeAIModal() {
    document.getElementById('aiModal').classList.remove('active');
    aiSuggestionCache = null;
}

function applyAISuggestion() {
    if (!aiSuggestionCache || aiSuggestionCache.content === undefined) {
        showToast('请选择一个建议');
        return;
    }
    
    const content = aiSuggestionCache.content;
    
    if (aiSuggestionCache.type === 'experience') {
        const exp = currentState.data.experience.find(e => e.id === aiSuggestionCache.id);
        if (exp) {
            exp.description = content;
            const textarea = document.querySelector(`.experience-item[data-id="${exp.id}"] textarea`);
            if (textarea) textarea.value = content;
        }
    } else {
        document.getElementById('summary').value = content;
        currentState.data.summary = content;
    }
    
    updatePreview();
    saveToLocalStorage();
    closeAIModal();
    showToast('已应用建议');
}

// ========================================
// Preview Rendering
// ========================================

function updatePreview() {
    const preview = document.getElementById('resumePreview');
    const { data, selectedTemplate } = currentState;
    
    preview.className = `resume-preview template-${selectedTemplate}`;
    preview.innerHTML = generateResumeHTML(data, selectedTemplate);
}

function generateResumeHTML(data, template) {
    const theme = themes[currentState.selectedTheme];
    
    const contactItems = [
        data.email && `<span>${data.email}</span>`,
        data.phone && `<span>${data.phone}</span>`,
        data.location && `<span>${data.location}</span>`,
        data.website && `<span>${data.website}</span>`
    ].filter(Boolean);

    const experienceHTML = data.experience.length > 0 
        ? data.experience.map(exp => `
            <div class="entry">
                <div class="entry-header">
                    <span class="entry-title">${exp.position || '职位'}</span>
                    <span class="entry-date">${exp.startDate || ''} - ${exp.endDate || '至今'}</span>
                </div>
                <div class="entry-subtitle">${exp.company || '公司名称'}</div>
                <div class="entry-description">${formatDescription(exp.description)}</div>
            </div>
        `).join('') : '';

    const educationHTML = data.education.length > 0
        ? data.education.map(edu => `
            <div class="entry">
                <div class="entry-header">
                    <span class="entry-title">${edu.school || '学校'}</span>
                    <span class="entry-date">${edu.date || ''}</span>
                </div>
                <div class="entry-subtitle">${edu.degree || ''}${edu.field ? ` - ${edu.field}` : ''}</div>
            </div>
        `).join('') : '';

    const skillsHTML = data.skills.length > 0
        ? `<div class="skills-list">${data.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>`
        : '';

    const languagesHTML = data.languages.length > 0
        ? data.languages.map(l => `<div class="sidebar-item">${l.name} - ${l.level}</div>`).join('')
        : '';

    const certificationsHTML = data.certifications
        ? `<div class="section-content">${formatDescription(data.certifications)}</div>`
        : '';

    // Template-specific HTML generation
    switch (template) {
        case 'creative':
            return generateCreativeTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML, languagesHTML);
        case 'twocolumn':
            return generateTwoColumnTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML);
        case 'executive':
            return generateExecutiveTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML);
        case 'classic':
            return generateClassicTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML);
        case 'minimal':
            return generateMinimalTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML);
        default:
            return generateModernTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML, certificationsHTML);
    }
}

function generateModernTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML, certificationsHTML) {
    return `
        <div class="template-modern">
            <div class="resume-header">
                <div class="header-left">
                    <h1 class="resume-name">${data.name || '姓名'}</h1>
                    <p class="resume-title">${data.title || '职位头衔'}</p>
                </div>
                <div class="header-right">
                    ${contactItems.map(item => `<div class="contact-item">${item}</div>`).join('')}
                </div>
            </div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h2 class="section-title">个人简介</h2>
                    <div class="section-content">${data.summary}</div>
                </div>
            ` : ''}
            
            ${experienceHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">工作经历</h2>
                    <div class="section-content">${experienceHTML}</div>
                </div>
            ` : ''}
            
            ${educationHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">教育背景</h2>
                    <div class="section-content">${educationHTML}</div>
                </div>
            ` : ''}
            
            ${skillsHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">技能专长</h2>
                    <div class="section-content">${skillsHTML}</div>
                </div>
            ` : ''}
            
            ${certificationsHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">证书与荣誉</h2>
                    ${certificationsHTML}
                </div>
            ` : ''}
        </div>
    `;
}

function generateClassicTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML) {
    return `
        <div class="template-classic">
            <div class="resume-header">
                <h1 class="resume-name">${data.name || '姓名'}</h1>
                <p class="resume-title">${data.title || '职位头衔'}</p>
                <div class="contact-row">${contactItems.join(' | ')}</div>
            </div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h2 class="section-title">个人简介</h2>
                    <div class="section-content">${data.summary}</div>
                </div>
            ` : ''}
            
            ${experienceHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">工作经历</h2>
                    <div class="section-content">${experienceHTML}</div>
                </div>
            ` : ''}
            
            ${educationHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">教育背景</h2>
                    <div class="section-content">${educationHTML}</div>
                </div>
            ` : ''}
            
            ${skillsHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">技能专长</h2>
                    <div class="section-content">${skillsHTML}</div>
                </div>
            ` : ''}
        </div>
    `;
}

function generateMinimalTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML) {
    return `
        <div class="template-minimal">
            <div class="resume-header">
                <h1 class="resume-name">${data.name || '姓名'}</h1>
                <p class="resume-title">${data.title || '职位头衔'}</p>
                <div class="contact-row">${contactItems.join(' · ')}</div>
            </div>
            
            ${data.summary ? `
                <div class="resume-section">
                    <h2 class="section-title">关于</h2>
                    <div class="section-content">${data.summary}</div>
                </div>
            ` : ''}
            
            ${experienceHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">经历</h2>
                    <div class="section-content">${experienceHTML}</div>
                </div>
            ` : ''}
            
            ${educationHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">教育</h2>
                    <div class="section-content">${educationHTML}</div>
                </div>
            ` : ''}
            
            ${skillsHTML ? `
                <div class="resume-section">
                    <h2 class="section-title">技能</h2>
                    <div class="section-content">${skillsHTML}</div>
                </div>
            ` : ''}
        </div>
    `;
}

function generateCreativeTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML, languagesHTML) {
    return `
        <div class="template-creative">
            <div class="sidebar">
                <h1 class="resume-name">${data.name || '姓名'}</h1>
                <p class="resume-title">${data.title || '职位头衔'}</p>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">联系方式</div>
                    ${contactItems.map(item => `<div class="sidebar-item">${item}</div>`).join('')}
                </div>
                
                ${skillsHTML ? `
                    <div class="sidebar-section">
                        <div class="sidebar-title">技能</div>
                        <div class="sidebar-item">${data.skills.join(' · ')}</div>
                    </div>
                ` : ''}
                
                ${languagesHTML ? `
                    <div class="sidebar-section">
                        <div class="sidebar-title">语言</div>
                        ${languagesHTML}
                    </div>
                ` : ''}
            </div>
            <div class="main-content">
                ${data.summary ? `
                    <div class="resume-section">
                        <h2 class="section-title">个人简介</h2>
                        <div class="section-content">${data.summary}</div>
                    </div>
                ` : ''}
                
                ${experienceHTML ? `
                    <div class="resume-section">
                        <h2 class="section-title">工作经历</h2>
                        <div class="section-content">${experienceHTML}</div>
                    </div>
                ` : ''}
                
                ${educationHTML ? `
                    <div class="resume-section">
                        <h2 class="section-title">教育背景</h2>
                        <div class="section-content">${educationHTML}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function generateTwoColumnTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML) {
    return `
        <div class="template-twocolumn">
            <div class="resume-header">
                <h1 class="resume-name">${data.name || '姓名'}</h1>
                <div class="contact-row">${contactItems.join(' | ')}</div>
            </div>
            
            <div class="resume-body">
                <div class="column-left">
                    ${data.summary ? `
                        <div class="resume-section">
                            <h2 class="section-title">个人简介</h2>
                            <div class="section-content">${data.summary}</div>
                        </div>
                    ` : ''}
                    
                    ${experienceHTML ? `
                        <div class="resume-section">
                            <h2 class="section-title">工作经历</h2>
                            <div class="section-content">${experienceHTML}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="column-right">
                    ${educationHTML ? `
                        <div class="resume-section">
                            <h2 class="section-title">教育背景</h2>
                            <div class="section-content">${educationHTML}</div>
                        </div>
                    ` : ''}
                    
                    ${skillsHTML ? `
                        <div class="resume-section">
                            <h2 class="section-title">技能专长</h2>
                            <div class="section-content">${skillsHTML}</div>
                        </div>
                    ` : ''}
                    
                    ${data.certifications ? `
                        <div class="resume-section">
                            <h2 class="section-title">证书</h2>
                            <div class="section-content">${formatDescription(data.certifications)}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function generateExecutiveTemplate(data, contactItems, experienceHTML, educationHTML, skillsHTML) {
    return `
        <div class="template-executive">
            <div class="resume-header">
                <h1 class="resume-name">${data.name || '姓名'}</h1>
                <p class="resume-title">${data.title || '职位头衔'}</p>
            </div>
            
            <div style="padding: 0 20mm;">
                <div class="contact-row" style="margin-bottom: 1.5rem; text-align: center;">
                    ${contactItems.join(' · ')}
                </div>
                
                ${data.summary ? `
                    <div class="resume-section">
                        <h2 class="section-title">个人简介</h2>
                        <div class="section-content">${data.summary}</div>
                    </div>
                ` : ''}
                
                ${experienceHTML ? `
                    <div class="resume-section">
                        <h2 class="section-title">职业经历</h2>
                        <div class="section-content">${experienceHTML}</div>
                    </div>
                ` : ''}
                
                ${educationHTML ? `
                    <div class="resume-section">
                        <h2 class="section-title">教育背景</h2>
                        <div class="section-content">${educationHTML}</div>
                    </div>
                ` : ''}
                
                ${skillsHTML ? `
                    <div class="resume-section">
                        <h2 class="section-title">核心能力</h2>
                        <div class="section-content">${skillsHTML}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function formatDescription(text) {
    if (!text) return '';
    // Convert bullet points to HTML
    return text.split('\n').map(line => {
        line = line.trim();
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            return line;
        }
        if (line) {
            return '• ' + line;
        }
        return '';
    }).filter(Boolean).join('<br>');
}

// ========================================
// Zoom Controls
// ========================================

function adjustZoom(delta) {
    currentState.zoom = Math.max(0.3, Math.min(1.5, currentState.zoom + delta));
    document.getElementById('zoomLevel').textContent = Math.round(currentState.zoom * 100) + '%';
    document.getElementById('resumePreview').style.transform = `scale(${currentState.zoom})`;
}

function togglePreviewMode() {
    document.body.classList.toggle('preview-fullscreen');
}

// ========================================
// Export Functions
// ========================================

function showExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function exportPDF() {
    const element = document.getElementById('resumePreview');
    const filename = `简历_${currentState.data.name || '未命名'}.pdf`;
    
    const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    closeExportModal();
    showToast('正在生成 PDF...');

    html2pdf().set(opt).from(element).save().then(() => {
        showToast('PDF 下载成功！');
    }).catch(err => {
        console.error('PDF export failed:', err);
        showToast('PDF 生成失败，请重试', 'error');
    });
}

function exportWord() {
    const { data } = currentState;
    
    let content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>简历</title></head>
        <body>
        <h1>${data.name || '姓名'}</h1>
        <p><strong>${data.title || '职位'}</strong></p>
        <p>${data.email || ''} | ${data.phone || ''} | ${data.location || ''}</p>
        <hr>
        ${data.summary ? `<h2>个人简介</h2><p>${data.summary}</p>` : ''}
        ${data.experience.length > 0 ? `<h2>工作经历</h2>${data.experience.map(e => `
            <p><strong>${e.position}</strong> | ${e.company}</p>
            <p>${e.startDate} - ${e.endDate}</p>
            <p>${e.description}</p>
        `).join('')}` : ''}
        ${data.education.length > 0 ? `<h2>教育背景</h2>${data.education.map(e => `
            <p><strong>${e.school}</strong> - ${e.degree}</p>
            <p>${e.field} | ${e.date}</p>
        `).join('')}` : ''}
        ${data.skills.length > 0 ? `<h2>技能</h2><p>${data.skills.join(', ')}</p>` : ''}
        </body></html>
    `;

    const blob = new Blob(['\ufeff', content], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `简历_${data.name || '未命名'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    closeExportModal();
    showToast('Word 文档已下载');
}

function printResume() {
    window.print();
    closeExportModal();
}

// ========================================
// Local Storage
// ========================================

function saveToLocalStorage() {
    localStorage.setItem('resumegenPro_v2', JSON.stringify(currentState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('resumegenPro_v2');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            currentState = { ...currentState, ...parsed };
            
            // Restore form values
            Object.keys(currentState.data).forEach(key => {
                const input = document.querySelector(`[data-field="${key}"]`);
                if (input && currentState.data[key]) {
                    input.value = currentState.data[key];
                }
            });
            
            // Restore experience
            if (currentState.data.experience) {
                currentState.data.experience.forEach(exp => addExperience(exp));
            }
            
            // Restore education
            if (currentState.data.education) {
                currentState.data.education.forEach(edu => addEducation(edu));
            }
            
            // Restore skills
            renderSkills();
            
            // Restore languages
            if (currentState.data.languages) {
                currentState.data.languages.forEach(lang => addLanguage(lang));
            }
            
            // Restore theme
            const themeBtn = document.querySelector(`[data-theme="${currentState.selectedTheme}"]`);
            if (themeBtn) {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                themeBtn.classList.add('active');
            }
            
            // Restore template name
            const template = templates.find(t => t.id === currentState.selectedTemplate);
            if (template) {
                document.getElementById('currentTemplateName').textContent = template.name;
            }
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }
}

function resetData() {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复。')) return;
    
    currentState.data = {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: ''
    };
    
    // Clear form
    document.querySelectorAll('input, textarea').forEach(input => input.value = '');
    document.getElementById('experienceList').innerHTML = '';
    document.getElementById('educationList').innerHTML = '';
    document.getElementById('languagesList').innerHTML = '';
    renderSkills();
    
    experienceCount = 0;
    educationCount = 0;
    languageCount = 0;
    
    updatePreview();
    saveToLocalStorage();
    showToast('数据已重置');
}

// ========================================
// Toast Notification
// ========================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('i');
    icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    icon.style.color = type === 'error' ? 'var(--error)' : 'var(--success)';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// Global Functions (for onclick handlers)
// ========================================

window.showTemplateSelection = showTemplateSelection;
window.closeModal = closeModal;
window.selectTemplate = selectTemplate;
window.backToLanding = backToLanding;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.finishAndExport = finishAndExport;
window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.addLanguage = addLanguage;
window.removeLanguage = removeLanguage;
window.generateAISummary = generateAISummary;
window.suggestSkills = suggestSkills;
window.optimizeExperience = optimizeExperience;
window.showAIModal = showAIModal;
window.selectSuggestion = selectSuggestion;
window.closeAIModal = closeAIModal;
window.applyAISuggestion = applyAISuggestion;
window.adjustZoom = adjustZoom;
window.togglePreviewMode = togglePreviewMode;
window.showExportModal = showExportModal;
window.closeExportModal = closeExportModal;
window.exportPDF = exportPDF;
window.exportWord = exportWord;
window.printResume = printResume;
window.resetData = resetData;
