// Variáveis globais
let reportData = {};
let charts = {};

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Botões
    const generateReportBtn = document.getElementById('generateReportBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    // Eventos
    generateReportBtn.addEventListener('click', generateReport);
    resetBtn.addEventListener('click', resetForm);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    shareBtn.addEventListener('click', shareReport);
    
    // Calcular CTR automaticamente quando cliques ou impressões mudam
    document.getElementById('clicks').addEventListener('input', calculateCTR);
    document.getElementById('impressions').addEventListener('input', calculateCTR);
});

// Calcular CTR automaticamente (CTR = Cliques / Impressões * 100)
function calculateCTR() {
    const clicks = parseFloat(document.getElementById('clicks').value) || 0;
    const impressions = parseFloat(document.getElementById('impressions').value) || 0;
    
    if (impressions > 0) {
        const ctr = (clicks / impressions * 100).toFixed(2);
        document.getElementById('ctr').value = ctr;
    }
}

// Coletar dados do formulário
function collectFormData() {
    // Formatar período da campanha a partir das datas inicial e final
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('pt-BR') : '';
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('pt-BR') : '';
    const campaignPeriod = formattedStartDate && formattedEndDate ? 
        `${formattedStartDate} a ${formattedEndDate}` : '';
    
    reportData = {
        clientName: document.getElementById('clientName').value,
        campaignName: document.getElementById('campaignName').value,
        campaignPeriod: campaignPeriod,
        objective: document.getElementById('objective').value,
        reach: parseInt(document.getElementById('reach').value) || 0,
        impressions: parseInt(document.getElementById('impressions').value) || 0,
        clicks: parseInt(document.getElementById('clicks').value) || 0,
        ctr: parseFloat(document.getElementById('ctr').value) || 0,
        investment: parseFloat(document.getElementById('investment').value) || 0,
        cpr: parseFloat(document.getElementById('cpr').value) || 0,
        results: parseInt(document.getElementById('results').value) || 0,
        observations: document.getElementById('observations').value,
        recommendations: document.getElementById('recommendations').value,
        date: new Date().toLocaleDateString('pt-BR')
    };
    
    return reportData;
}

// Validar formulário
function validateForm() {
    const form = document.getElementById('campaignForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Gerar relatório
function generateReport() {
    if (!validateForm()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Coletar dados do formulário
    collectFormData();
    
    // Mostrar área de relatório
    document.getElementById('reportPreview').style.display = 'block';
    
    // Gerar conteúdo do relatório
    generateReportContent();
    
    // Rolar para a área do relatório
    document.getElementById('reportPreview').scrollIntoView({ behavior: 'smooth' });
}

// Gerar conteúdo do relatório
function generateReportContent() {
    const reportContent = document.getElementById('reportContent');
    
    // Estrutura do relatório
    reportContent.innerHTML = `
        <!-- Capa do Relatório -->
        <div class="report-header">
            <h2>Relatório de Campanha</h2>
            <h3>${reportData.clientName}</h3>
            <p>${reportData.campaignPeriod}</p>
            <div class="mt-4 mb-4">
                <img src="img/logos/LogoVerde.png" alt="Jota R Marketing" class="img-fluid" style="max-width: 150px;">
            </div>
        </div>
        
        <!-- Visão Geral da Campanha -->
        <div class="report-section">
            <h4 class="section-title">Visão Geral da Campanha</h4>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Nome da Campanha:</strong> ${reportData.campaignName}</p>
                    <p><strong>Objetivo:</strong> ${reportData.objective}</p>
                    <p><strong>Período:</strong> ${reportData.campaignPeriod}</p>
                    <p><strong>Investimento Total:</strong> R$ ${reportData.investment.toFixed(2)}</p>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Resultados Principais</h5>
                            <div class="row text-center">
                                <div class="col-4">
                                    <h3>${reportData.reach.toLocaleString('pt-BR')}</h3>
                                    <p>Alcance</p>
                                </div>
                                <div class="col-4">
                                    <h3>${reportData.clicks.toLocaleString('pt-BR')}</h3>
                                    <p>Cliques</p>
                                </div>
                                <div class="col-4">
                                    <h3>${reportData.results.toLocaleString('pt-BR')}</h3>
                                    <p>Resultados</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Análise dos Resultados -->
        <div class="report-section">
            <h4 class="section-title">Análise dos Resultados</h4>
            <div class="row">
                <div class="col-md-6">
                    <div class="chart-container">
                        <canvas id="performanceChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="chart-container">
                        <canvas id="conversionChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Métrica</th>
                                <th>Valor</th>
                                <th>Análise</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CTR</td>
                                <td>${reportData.ctr}%</td>
                                <td>${getCTRAnalysis(reportData.ctr)}</td>
                            </tr>
                            <tr>
                                <td>Custo por Resultado</td>
                                <td>R$ ${reportData.cpr.toFixed(2)}</td>
                                <td>${getCPRAnalysis(reportData.cpr, reportData.objective)}</td>
                            </tr>
                            <tr>
                                <td>Taxa de Conversão</td>
                                <td>${(reportData.results / reportData.clicks * 100).toFixed(2)}%</td>
                                <td>${getConversionAnalysis((reportData.results / reportData.clicks * 100))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Destaques e Oportunidades -->
        <div class="report-section">
            <h4 class="section-title">Destaques e Oportunidades</h4>
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Observações e Insights</h5>
                    <p>${reportData.observations || "Nenhuma observação registrada."}</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Pontos Fortes</h5>
                            <ul>
                                ${getStrengths(reportData)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Oportunidades de Melhoria</h5>
                            <ul>
                                ${getOpportunities(reportData)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recomendações -->
        <div class="report-section">
            <h4 class="section-title">Recomendações para o Próximo Mês</h4>
            <div class="card">
                <div class="card-body">
                    <p>${reportData.recommendations || "Nenhuma recomendação registrada."}</p>
                </div>
            </div>
        </div>
        
        <!-- Rodapé do Relatório -->
        <div class="report-footer">
            <p>Relatório gerado em ${reportData.date} | Jota R Marketing</p>
        </div>
    `;
    
    // Criar gráficos
    setTimeout(() => {
        createPerformanceChart();
        createConversionChart();
    }, 100);
}

// Criar gráfico de desempenho
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (charts.performanceChart) {
        charts.performanceChart.destroy();
    }
    
    charts.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Alcance', 'Impressões', 'Cliques'],
            datasets: [{
                label: 'Desempenho da Campanha',
                data: [reportData.reach, reportData.impressions, reportData.clicks],
                backgroundColor: [
                    '#004225',
                    '#FFA725',
                    '#004225'
                ],
                borderColor: [
                    '#004225',
                    '#FFA725',
                    '#004225'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Criar gráfico de conversão
function createConversionChart() {
    const ctx = document.getElementById('conversionChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (charts.conversionChart) {
        charts.conversionChart.destroy();
    }
    
    // Calcular taxa de conversão e taxa de rejeição
    const conversionRate = (reportData.results / reportData.clicks) * 100;
    const bounceRate = 100 - conversionRate;
    
    charts.conversionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Conversões', 'Não Convertidos'],
            datasets: [{
                data: [conversionRate, bounceRate],
                backgroundColor: [
                    '#FFA725',
                    '#e0e0e0'
                ],
                borderColor: [
                    '#FFA725',
                    '#e0e0e0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Taxa de Conversão'
                }
            }
        }
    });
}

// Análises baseadas nos dados
function getCTRAnalysis(ctr) {
    if (ctr < 1) {
        return "Abaixo da média. Considere revisar os criativos e segmentação.";
    } else if (ctr < 2) {
        return "Dentro da média do mercado para campanhas similares.";
    } else {
        return "Acima da média! Os anúncios estão ressoando bem com o público.";
    }
}

function getCPRAnalysis(cpr, objective) {
    if (objective === 'Tráfego') {
        return cpr < 0.80 ? "Excelente custo por clique!" : "Custo por clique um pouco elevado.";
    } else if (objective === 'Conversão') {
        return cpr < 25 ? "Bom custo por conversão." : "Custo por conversão acima do ideal.";
    } else {
        return cpr < 10 ? "Custo eficiente para o objetivo." : "Considere otimizar para reduzir custos.";
    }
}

function getConversionAnalysis(conversionRate) {
    if (conversionRate < 5) {
        return "Abaixo do esperado. Verifique a jornada pós-clique.";
    } else if (conversionRate < 10) {
        return "Taxa de conversão dentro da média do setor.";
    } else {
        return "Excelente taxa de conversão!";
    }
}

// Gerar pontos fortes com base nos dados
function getStrengths(data) {
    let strengths = [];
    
    if (data.ctr > 1.5) {
        strengths.push("<li>CTR acima da média do mercado</li>");
    }
    
    if (data.reach > 10000) {
        strengths.push("<li>Excelente alcance da campanha</li>");
    }
    
    if ((data.results / data.clicks * 100) > 8) {
        strengths.push("<li>Boa taxa de conversão</li>");
    }
    
    if (data.objective === 'Tráfego' && data.cpr < 0.80) {
        strengths.push("<li>Custo por clique muito eficiente</li>");
    }
    
    if (strengths.length === 0) {
        strengths.push("<li>Campanha executada conforme planejado</li>");
    }
    
    return strengths.join("");
}

// Gerar oportunidades com base nos dados
function getOpportunities(data) {
    let opportunities = [];
    
    if (data.ctr < 1) {
        opportunities.push("<li>Melhorar a relevância dos anúncios para aumentar o CTR</li>");
    }
    
    if ((data.results / data.clicks * 100) < 5) {
        opportunities.push("<li>Otimizar a página de destino para aumentar conversões</li>");
    }
    
    if (data.objective === 'Tráfego' && data.cpr > 1) {
        opportunities.push("<li>Refinar a segmentação para reduzir o custo por clique</li>");
    }
    
    if (data.objective === 'Conversão' && data.cpr > 30) {
        opportunities.push("<li>Revisar o funil de conversão para reduzir custos</li>");
    }
    
    if (opportunities.length === 0) {
        opportunities.push("<li>Expandir o orçamento para ampliar os resultados positivos</li>");
    }
    
    return opportunities.join("");
}

// Resetar formulário
function resetForm() {
    document.getElementById('campaignForm').reset();
    document.getElementById('reportPreview').style.display = 'none';
}

// Baixar PDF
function downloadPDF() {
    // Mostrar mensagem de carregamento
    alert("Preparando o PDF para download...");
    
    const { jsPDF } = window.jspdf;
    const reportElement = document.getElementById('reportContent');
    
    // Configurar PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Usar html2canvas para capturar o relatório como imagem
    html2canvas(reportElement, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calcular proporção para manter a relação de aspecto
        const imgWidth = pageWidth - 20; // Margem de 10mm em cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Adicionar páginas conforme necessário
        let heightLeft = imgHeight;
        let position = 10; // Margem superior inicial
        
        // Adicionar primeira página
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
        
        // Adicionar páginas adicionais se necessário
        while (heightLeft > 0) {
            position = 10 - (pageHeight - 20); // Reposicionar para a próxima página
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - 20);
        }
        
        // Salvar PDF
        pdf.save(`Relatorio_${reportData.clientName}_${reportData.campaignName}.pdf`);
    });
}

// Compartilhar relatório
function shareReport() {
    // Simulação de compartilhamento (em uma aplicação real, isso seria implementado com APIs de compartilhamento)
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
                            <input type="text" class="form-control" value="https://jota-r-marketing.com/relatorio/temp-link" readonly>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-success" type="button">
                                <i class="fab fa-whatsapp me-2"></i>Enviar via WhatsApp
                            </button>
                            <button class="btn btn-primary" type="button">
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
    
    // Em uma implementação real, aqui seria feita a integração com APIs de compartilhamento
    alert("Funcionalidade de compartilhamento simulada. Em uma aplicação real, isso seria integrado com APIs de WhatsApp e e-mail.");
}
