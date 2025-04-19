// Variáveis globais
let serviceCounter = 1;
let proposalData = {};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar manipuladores de eventos
    document.getElementById('addServiceBtn').addEventListener('click', addServiceItem);
    document.getElementById('generateProposalBtn').addEventListener('click', generateProposal);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('editProposalBtn').addEventListener('click', editProposal);
    document.getElementById('downloadPDFBtn').addEventListener('click', downloadPDF);
    document.getElementById('shareProposalBtn').addEventListener('click', shareProposal);
});

// Adicionar um novo item de serviço
function addServiceItem() {
    serviceCounter++;
    
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    serviceItem.id = `service-${serviceCounter}`;
    
    serviceItem.innerHTML = `
        <div class="d-flex justify-content-end mb-2">
            <button type="button" class="btn btn-sm btn-outline-danger remove-service" onclick="removeServiceItem(${serviceCounter})">
                <i class="fas fa-times"></i> Remover
            </button>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="serviceTitle-${serviceCounter}" class="form-label">Título do Serviço</label>
                <input type="text" class="form-control" id="serviceTitle-${serviceCounter}" placeholder="Ex: Gestão de redes sociais" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="servicePrice-${serviceCounter}" class="form-label">Valor (R$)</label>
                <div class="input-group">
                    <span class="input-group-text">R$</span>
                    <input type="number" step="0.01" class="form-control" id="servicePrice-${serviceCounter}" required>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="serviceDescription-${serviceCounter}" class="form-label">Descrição do Serviço</label>
            <textarea class="form-control" id="serviceDescription-${serviceCounter}" rows="2" placeholder="Ex: Criação de conteúdo, cronograma, publicações, interação" required></textarea>
        </div>
    `;
    
    document.getElementById('servicesContainer').appendChild(serviceItem);
}

// Remover um item de serviço
function removeServiceItem(id) {
    const serviceItem = document.getElementById(`service-${id}`);
    if (serviceItem) {
        serviceItem.remove();
    }
}

// Coletar dados do formulário
function collectFormData() {
    // Dados do cliente
    proposalData.clientName = document.getElementById('clientName').value;
    proposalData.clientContact = document.getElementById('clientContact').value;
    proposalData.clientSegment = document.getElementById('clientSegment').value;
    proposalData.clientDocument = document.getElementById('clientDocument').value;
    
    // Objetivos do cliente
    proposalData.objectives = [];
    if (document.getElementById('objectiveLeads').checked) {
        proposalData.objectives.push(document.getElementById('objectiveLeads').value);
    }
    if (document.getElementById('objectiveSales').checked) {
        proposalData.objectives.push(document.getElementById('objectiveSales').value);
    }
    if (document.getElementById('objectiveInstagram').checked) {
        proposalData.objectives.push(document.getElementById('objectiveInstagram').value);
    }
    if (document.getElementById('objectiveTraffic').checked) {
        proposalData.objectives.push(document.getElementById('objectiveTraffic').value);
    }
    
    const otherObjectives = document.getElementById('otherObjectives').value.trim();
    if (otherObjectives) {
        proposalData.objectives.push(otherObjectives);
    }
    
    // Serviços propostos
    proposalData.services = [];
    for (let i = 1; i <= serviceCounter; i++) {
        const serviceElement = document.getElementById(`service-${i}`);
        if (serviceElement) {
            const titleElement = document.getElementById(`serviceTitle-${i}`);
            const descriptionElement = document.getElementById(`serviceDescription-${i}`);
            const priceElement = document.getElementById(`servicePrice-${i}`);
            
            if (titleElement && descriptionElement && priceElement) {
                proposalData.services.push({
                    title: titleElement.value,
                    description: descriptionElement.value,
                    price: parseFloat(priceElement.value) || 0
                });
            }
        }
    }
    
    // Investimento em anúncios
    proposalData.adInvestment = parseFloat(document.getElementById('adInvestment').value) || 0;
    
    // Condições da proposta
    proposalData.validityPeriod = document.getElementById('validityPeriod').value;
    proposalData.discountPercentage = parseInt(document.getElementById('discountPercentage').value) || 0;
    proposalData.additionalNotes = document.getElementById('additionalNotes').value;
    
    // Calcular valores totais
    proposalData.servicesValue = proposalData.services.reduce((total, service) => total + service.price, 0);
    proposalData.monthlyAdValue = proposalData.adInvestment * 30;
    proposalData.totalValue = proposalData.servicesValue + proposalData.monthlyAdValue;
    proposalData.discountValue = proposalData.totalValue * (proposalData.discountPercentage / 100);
    proposalData.finalValue = proposalData.totalValue - proposalData.discountValue;
    
    // Data de geração
    proposalData.generationDate = new Date().toLocaleDateString('pt-BR');
    
    return proposalData;
}

// Validar formulário
function validateForm() {
    const form = document.getElementById('proposalForm');
    
    // Verificar campos obrigatórios
    if (!document.getElementById('clientName').value) {
        alert('Por favor, informe o nome do cliente/empresa.');
        return false;
    }
    
    if (!document.getElementById('clientContact').value) {
        alert('Por favor, informe um contato (WhatsApp ou e-mail).');
        return false;
    }
    
    if (!document.getElementById('clientSegment').value) {
        alert('Por favor, informe o segmento ou ramo de atuação.');
        return false;
    }
    
    if (proposalData.objectives.length === 0) {
        alert('Por favor, selecione pelo menos um objetivo.');
        return false;
    }
    
    if (proposalData.services.length === 0) {
        alert('Por favor, adicione pelo menos um serviço.');
        return false;
    }
    
    for (const service of proposalData.services) {
        if (!service.title || !service.description || service.price <= 0) {
            alert('Por favor, preencha todos os campos de serviço corretamente.');
            return false;
        }
    }
    
    if (!document.getElementById('validityPeriod').value) {
        alert('Por favor, informe o prazo de validade da proposta.');
        return false;
    }
    
    return true;
}

// Gerar proposta
function generateProposal() {
    collectFormData();
    
    if (!validateForm()) {
        return;
    }
    
    const proposalContent = document.getElementById('proposalContent');
    
    // Estrutura da proposta
    proposalContent.innerHTML = `
        <!-- Capa da Proposta -->
        <div class="proposal-cover">
            <img src="img/logos/LogoVerde.png" alt="Jota R Marketing" class="img-fluid" style="max-width: 200px;">
            <h1>Proposta Comercial Personalizada</h1>
            <h3>para ${proposalData.clientName}</h3>
            <p>Data: ${proposalData.generationDate}</p>
        </div>
        
        <!-- Apresentação da Empresa -->
        <div class="mb-5">
            <h2 class="proposal-section-title">Apresentação</h2>
            <p>A <strong>Jota R Marketing</strong> é uma agência especializada em marketing digital, focada em resultados mensuráveis e crescimento sustentável para nossos clientes.</p>
            <p>Trabalhamos com estratégias personalizadas que se adaptam às necessidades específicas de cada negócio, utilizando as melhores práticas do mercado e ferramentas de última geração.</p>
            <p>Nossa equipe é formada por profissionais experientes e apaixonados por marketing digital, sempre atualizados com as últimas tendências e tecnologias do setor.</p>
        </div>
        
        <!-- Objetivos do Cliente -->
        <div class="mb-5">
            <h2 class="proposal-section-title">Objetivos</h2>
            <p>Com base nas informações fornecidas, identificamos os seguintes objetivos para o seu negócio:</p>
            <div class="row">
                ${proposalData.objectives.map(objective => `
                    <div class="col-md-6 mb-3">
                        <div class="proposal-objective">
                            <i class="fas fa-check-circle me-2" style="color: #FFA725;"></i>${objective}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Soluções Propostas -->
        <div class="mb-5">
            <h2 class="proposal-section-title">Soluções Propostas</h2>
            <p>Para atingir seus objetivos, recomendamos as seguintes soluções:</p>
            
            ${proposalData.services.map(service => `
                <div class="proposal-service">
                    <h4>${service.title}</h4>
                    <p>${service.description}</p>
                    <p class="service-price">Investimento: R$ ${service.price.toFixed(2)}</p>
                </div>
            `).join('')}
            
            ${proposalData.adInvestment > 0 ? `
                <div class="proposal-service">
                    <h4>Investimento Diário em Anúncios</h4>
                    <p>Valor recomendado para investimento diário em campanhas de anúncios pagos.</p>
                    <p class="service-price">Investimento: R$ ${proposalData.adInvestment.toFixed(2)}/dia</p>
                </div>
            ` : ''}
        </div>
        
        <!-- Resumo de Investimento -->
        <div class="mb-5">
            <h2 class="proposal-section-title">Resumo de Investimento</h2>
            
            <div class="proposal-total">
                <div class="row">
                    <div class="col-md-8">
                        <h4>Valor Total Mensal (Gestão)</h4>
                        <p class="mb-0">Inclui todos os serviços listados acima</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <h4>R$ ${proposalData.totalValue.toFixed(2)}</h4>
                    </div>
                </div>
                
                ${proposalData.adInvestment > 0 ? `
                    <div class="row mt-3">
                        <div class="col-md-8">
                            <h4>Investimento Sugerido para Tráfego Pago</h4>
                            <p class="mb-0">Valor diário × 30 dias</p>
                            <small class="text-white">* Este valor será pago separadamente e não está incluído no somatório final.</small>
                        </div>
                        <div class="col-md-4 text-end">
                            <h4>R$ ${(proposalData.adInvestment * 30).toFixed(2)}</h4>
                        </div>
                    </div>
                ` : ''}
                
                ${proposalData.discountPercentage > 0 ? `
                    <div class="row mt-3">
                        <div class="col-md-8">
                            <h4>Desconto Especial (${proposalData.discountPercentage}%)</h4>
                        </div>
                        <div class="col-md-4 text-end">
                            <h4 class="discount">- R$ ${proposalData.discountValue.toFixed(2)}</h4>
                        </div>
                    </div>
                    
                    <div class="row mt-3" style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px;">
                        <div class="col-md-8">
                            <h3>Valor Final com Desconto</h3>
                        </div>
                        <div class="col-md-4 text-end">
                            <h3>R$ ${proposalData.finalValue.toFixed(2)}</h3>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            ${proposalData.additionalNotes ? `
                <div class="mt-4">
                    <h4>Observações Adicionais</h4>
                    <p>${proposalData.additionalNotes}</p>
                </div>
            ` : ''}
        </div>
        
        <!-- Chamada para Ação -->
        <div class="proposal-cta">
            Vamos colocar seu negócio no topo do digital? Fechando até ${proposalData.validityPeriod}, 
            ${proposalData.discountPercentage > 0 ? `você garante um desconto exclusivo de ${proposalData.discountPercentage}%!` : 'você garante estas condições especiais!'}
        </div>
        
        <!-- Assinaturas -->
        <div class="proposal-signature">
            <div class="row">
                <div class="col-md-6">
                    <h4>Contratante</h4>
                    <div class="signature-line">
                        <p>${proposalData.clientName}</p>
                        <p>CPF/CNPJ: ${proposalData.clientDocument || "_______________________"}</p>
                        <p>Cargo: _________________________</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4>Contratada</h4>
                    <div class="signature-line">
                        <p>Jota R Marketing</p>
                        <p>CPF: 43926692898</p>
                        <p>Representante: Jailson Santana</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Mostrar a visualização da proposta
    document.getElementById('proposalPreview').style.display = 'block';
    
    // Rolar para a visualização
    document.getElementById('proposalPreview').scrollIntoView({ behavior: 'smooth' });
}

// Editar proposta
function editProposal() {
    document.getElementById('proposalPreview').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Resetar formulário
function resetForm() {
    document.getElementById('proposalForm').reset();
    
    // Remover serviços adicionais
    const servicesContainer = document.getElementById('servicesContainer');
    const serviceItems = servicesContainer.querySelectorAll('.service-item');
    
    for (let i = 1; i < serviceItems.length; i++) {
        serviceItems[i].remove();
    }
    
    // Resetar contador
    serviceCounter = 1;
    
    // Esconder visualização da proposta
    document.getElementById('proposalPreview').style.display = 'none';
}

// Baixar PDF
function downloadPDF() {
    // Mostrar mensagem de carregamento
    alert("Preparando o PDF para download...");
    
    const { jsPDF } = window.jspdf;
    const proposalElement = document.getElementById('proposalContent');
    
    // Configurar PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Usar html2canvas para capturar a proposta como imagem
    html2canvas(proposalElement, {
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
        pdf.save(`Proposta_${proposalData.clientName}_${proposalData.generationDate}.pdf`);
    });
}

// Compartilhar proposta
function shareProposal() {
    // Simulação de compartilhamento (em uma aplicação real, isso seria implementado com APIs de compartilhamento)
    const shareOptions = `
        <div class="modal fade" id="shareModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Compartilhar Proposta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Link para compartilhamento:</label>
                            <input type="text" class="form-control" value="https://jota-r-marketing.com/proposta/temp-link" readonly>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-success" type="button">
                                <i class="fab fa-whatsapp me-2"></i>Enviar via WhatsApp
                            </button>
                            <button class="btn btn-primary" type="button">
                                <i class="far fa-envelope me-2"></i>Enviar por E-mail
                            </button>
                            <button class="btn btn-secondary" type="button">
                                <i class="far fa-copy me-2"></i>Copiar Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = shareOptions;
    document.body.appendChild(modalContainer);
    
    // Mostrar modal
    const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();
}
