// Simulação de backend para armazenamento de dados
class DataStorage {
    constructor() {
        this.reports = [];
        this.loadFromLocalStorage();
    }

    // Carregar dados do localStorage
    loadFromLocalStorage() {
        try {
            const savedReports = localStorage.getItem('jotaRReports');
            if (savedReports) {
                this.reports = JSON.parse(savedReports);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.reports = [];
        }
    }

    // Salvar dados no localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('jotaRReports', JSON.stringify(this.reports));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    // Adicionar novo relatório
    addReport(reportData) {
        // Adicionar ID e timestamp
        const report = {
            ...reportData,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        
        this.reports.push(report);
        return this.saveToLocalStorage();
    }

    // Obter todos os relatórios
    getAllReports() {
        return [...this.reports];
    }

    // Obter relatório por ID
    getReportById(id) {
        return this.reports.find(report => report.id === id);
    }

    // Obter relatórios por cliente
    getReportsByClient(clientName) {
        return this.reports.filter(report => 
            report.clientName.toLowerCase().includes(clientName.toLowerCase())
        );
    }

    // Excluir relatório
    deleteReport(id) {
        const initialLength = this.reports.length;
        this.reports = this.reports.filter(report => report.id !== id);
        
        if (initialLength !== this.reports.length) {
            return this.saveToLocalStorage();
        }
        return false;
    }

    // Gerar ID único
    generateId() {
        return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Classe para integração com WhatsApp (simulada)
class WhatsAppIntegration {
    constructor() {
        this.isAvailable = false;
        this.checkAvailability();
    }

    // Verificar disponibilidade da API do WhatsApp
    checkAvailability() {
        // Simulação - em um ambiente real, verificaria a disponibilidade da API
        this.isAvailable = true;
        console.log('WhatsApp API simulada disponível');
        return this.isAvailable;
    }

    // Enviar relatório via WhatsApp
    sendReport(phoneNumber, reportLink, clientName) {
        if (!this.isAvailable) {
            return { success: false, message: 'API do WhatsApp não disponível' };
        }

        if (!phoneNumber || !reportLink) {
            return { success: false, message: 'Número de telefone e link do relatório são obrigatórios' };
        }

        // Simulação de envio - em um ambiente real, usaria a API do WhatsApp Business
        console.log(`Simulando envio de relatório para ${phoneNumber}`);
        console.log(`Link: ${reportLink}`);
        console.log(`Cliente: ${clientName}`);

        // Simular sucesso após 1 segundo
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    message: `Relatório enviado com sucesso para ${phoneNumber}` 
                });
            }, 1000);
        });
    }
}

// Inicializar serviços de backend
const dataStorage = new DataStorage();
const whatsAppService = new WhatsAppIntegration();

// Modificar o código existente para usar o backend
document.addEventListener('DOMContentLoaded', function() {
    // Código existente...
    
    // Adicionar funcionalidade para salvar relatório
    const saveReportBtn = document.createElement('button');
    saveReportBtn.className = 'btn btn-sm btn-outline-light me-2';
    saveReportBtn.innerHTML = '<i class="fas fa-save me-1"></i> Salvar';
    saveReportBtn.addEventListener('click', saveReport);
    
    // Adicionar botão ao cabeçalho do relatório
    const reportHeaderBtns = document.querySelector('#reportPreview .card-header div');
    if (reportHeaderBtns) {
        reportHeaderBtns.prepend(saveReportBtn);
    }
    
    // Adicionar histórico de relatórios
    const historyBtn = document.createElement('button');
    historyBtn.className = 'btn btn-outline-secondary ms-2';
    historyBtn.innerHTML = '<i class="fas fa-history me-1"></i> Histórico';
    historyBtn.addEventListener('click', showReportHistory);
    
    // Adicionar botão ao formulário
    const formBtns = document.querySelector('#campaignForm .d-grid');
    if (formBtns) {
        formBtns.appendChild(historyBtn);
    }
});

// Função para salvar relatório
function saveReport() {
    if (!reportData || !reportData.clientName) {
        alert('Não há relatório para salvar. Gere um relatório primeiro.');
        return;
    }
    
    const success = dataStorage.addReport(reportData);
    
    if (success) {
        alert('Relatório salvo com sucesso!');
    } else {
        alert('Erro ao salvar o relatório. Tente novamente.');
    }
}

// Função para mostrar histórico de relatórios
function showReportHistory() {
    const reports = dataStorage.getAllReports();
    
    let historyHTML = `
        <div class="modal fade" id="historyModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Histórico de Relatórios</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
    `;
    
    if (reports.length === 0) {
        historyHTML += '<p class="text-center">Nenhum relatório salvo.</p>';
    } else {
        historyHTML += `
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Campanha</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        reports.forEach(report => {
            const date = new Date(report.createdAt).toLocaleDateString('pt-BR');
            historyHTML += `
                <tr>
                    <td>${report.clientName}</td>
                    <td>${report.campaignName}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary load-report" data-id="${report.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-report" data-id="${report.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        historyHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    historyHTML += `
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', historyHTML);
    
    // Mostrar modal
    const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    historyModal.show();
    
    // Adicionar event listeners para os botões
    document.querySelectorAll('.load-report').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            loadReport(reportId);
            historyModal.hide();
        });
    });
    
    document.querySelectorAll('.delete-report').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este relatório?')) {
                deleteReport(reportId);
                this.closest('tr').remove();
                
                // Se não houver mais relatórios, atualizar a tabela
                if (document.querySelectorAll('#historyModal tbody tr').length === 0) {
                    document.querySelector('#historyModal .modal-body').innerHTML = 
                        '<p class="text-center">Nenhum relatório salvo.</p>';
                }
            }
        });
    });
}

// Função para carregar relatório
function loadReport(reportId) {
    const report = dataStorage.getReportById(reportId);
    
    if (!report) {
        alert('Relatório não encontrado.');
        return;
    }
    
    // Preencher formulário com dados do relatório
    document.getElementById('clientName').value = report.clientName;
    document.getElementById('campaignName').value = report.campaignName;
    document.getElementById('campaignPeriod').value = report.campaignPeriod;
    document.getElementById('objective').value = report.objective;
    document.getElementById('reach').value = report.reach;
    document.getElementById('impressions').value = report.impressions;
    document.getElementById('clicks').value = report.clicks;
    document.getElementById('ctr').value = report.ctr;
    document.getElementById('investment').value = report.investment;
    document.getElementById('cpr').value = report.cpr;
    document.getElementById('results').value = report.results;
    document.getElementById('observations').value = report.observations;
    document.getElementById('recommendations').value = report.recommendations;
    
    // Gerar relatório
    generateReport();
}

// Função para excluir relatório
function deleteReport(reportId) {
    const success = dataStorage.deleteReport(reportId);
    
    if (success) {
        console.log('Relatório excluído com sucesso!');
    } else {
        alert('Erro ao excluir o relatório. Tente novamente.');
    }
}

// Modificar a função de compartilhamento para usar a integração com WhatsApp
function shareReport() {
    // Verificar se a integração com WhatsApp está disponível
    const whatsAppAvailable = whatsAppService.isAvailable;
    
    const shareOptions = `
        <div class="modal fade" id="shareModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Compartilhar Relatório</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Link para compartilhamento:</label>
                            <input type="text" class="form-control" id="shareLink" value="https://jota-r-marketing.com/relatorio/temp-link" readonly>
                            <button class="btn btn-sm btn-outline-secondary mt-2" onclick="copyShareLink()">Copiar Link</button>
                        </div>
                        ${whatsAppAvailable ? `
                        <div class="mb-3">
                            <label class="form-label">Enviar via WhatsApp:</label>
                            <div class="input-group">
                                <input type="tel" class="form-control" id="whatsappNumber" placeholder="Ex: 5511999999999">
                                <button class="btn btn-success" type="button" id="sendWhatsAppBtn">
                                    <i class="fab fa-whatsapp me-2"></i>Enviar
                                </button>
                            </div>
                            <small class="form-text text-muted">Digite o número com código do país e DDD, sem espaços ou caracteres especiais.</small>
                        </div>
                        ` : ''}
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" type="button" id="sendEmailBtn">
                                <i class="far fa-envelope me-2"></i>Enviar por E-mail
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', shareOptions);
    
    // Mostrar modal
    const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();
    
    // Adicionar event listener para o botão de WhatsApp
    if (whatsAppAvailable) {
        document.getElementById('sendWhatsAppBtn').addEventListener('click', function() {
            const phoneNumber = document.getElementById('whatsappNumber').value;
            const shareLink = document.getElementById('shareLink').value;
            
            if (!phoneNumber) {
                alert('Por favor, digite um número de telefone válido.');
                return;
            }
            
            // Mostrar indicador de carregamento
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            this.disabled = true;
            
            // Enviar relatório via WhatsApp
            whatsAppService.sendReport(phoneNumber, shareLink, reportData.clientName)
                .then(result => {
                    if (result.success) {
                        alert('Relatório enviado com sucesso via WhatsApp!');
                        shareModal.hide();
                    } else {
                        alert('Erro ao enviar relatório: ' + result.message);
                        this.innerHTML = '<i class="fab fa-whatsapp me-2"></i>Enviar';
                        this.disabled = false;
                    }
                });
        });
    }
    
    // Adicionar event listener para o botão de e-mail
    document.getElementById('sendEmailBtn').addEventListener('click', function() {
        // Simulação de envio de e-mail
        alert('Funcionalidade de envio por e-mail simulada. Em uma aplicação real, isso seria integrado com um serviço de e-mail.');
    });
}

// Função para copiar link de compartilhamento
function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    // Mostrar feedback
    const button = document.querySelector('button[onclick="copyShareLink()"]');
    const originalText = button.innerHTML;
    button.innerHTML = 'Copiado!';
    button.classList.add('btn-success');
    button.classList.remove('btn-outline-secondary');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
    }, 2000);
}
