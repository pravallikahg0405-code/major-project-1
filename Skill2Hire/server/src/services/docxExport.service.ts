import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { IResumeData } from '../types';

export class DOCXExportService {
  /**
   * Generates a single-column, ATS-compliant Microsoft Word (.docx) document
   */
  public static async generateResumeDOCX(resume: IResumeData): Promise<Buffer> {
    const children: Paragraph[] = [];

    // Header: Name
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: resume.personalInfo.fullName || 'Candidate Name',
            bold: true,
            size: 32, // 16pt
            font: 'Calibri'
          })
        ]
      })
    );

    // Contact info line
    const contactLine = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location,
      resume.personalInfo.linkedin,
      resume.personalInfo.github
    ].filter(Boolean).join('  |  ');

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactLine,
            size: 20, // 10pt
            font: 'Calibri'
          })
        ]
      })
    );

    const createSectionHeader = (title: string) => {
      return new Paragraph({
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: '333333',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: 'Calibri'
          })
        ]
      });
    };

    // 1. Summary
    if (resume.professionalSummary) {
      children.push(createSectionHeader('Professional Summary'));
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: resume.professionalSummary,
              size: 20,
              font: 'Calibri'
            })
          ]
        })
      );
    }

    // 2. Technical Skills
    if (resume.skills) {
      children.push(createSectionHeader('Technical Skills'));
      const s = resume.skills;
      const skillLines = [
        { label: 'Programming Languages: ', val: s.programmingLanguages?.join(', ') },
        { label: 'Frameworks & Libraries: ', val: s.frameworks?.concat(s.libraries || []).join(', ') },
        { label: 'Databases: ', val: s.databases?.join(', ') },
        { label: 'Tools & Cloud: ', val: s.tools?.concat(s.cloud || []).join(', ') },
        { label: 'Soft Skills: ', val: resume.softSkills?.join(', ') }
      ].filter(l => l.val);

      skillLines.forEach(item => {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: item.label, bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: item.val || '', size: 20, font: 'Calibri' })
            ]
          })
        );
      });
    }

    // 3. Projects
    if (resume.projects && resume.projects.length > 0) {
      children.push(createSectionHeader('Technical Projects'));
      resume.projects.forEach(p => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: p.title, bold: true, size: 22, font: 'Calibri' }),
              new TextRun({ text: p.technologies?.length ? `  |  ${p.technologies.join(', ')}` : '', italics: true, size: 20, font: 'Calibri' })
            ]
          })
        );
        p.responsibilities?.forEach(bullet => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: bullet, size: 20, font: 'Calibri' })]
            })
          );
        });
      });
    }

    // 4. Experience
    if (resume.experience && resume.experience.length > 0) {
      children.push(createSectionHeader('Work Experience & Internships'));
      resume.experience.forEach(e => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: `${e.role} — ${e.company}`, bold: true, size: 22, font: 'Calibri' }),
              new TextRun({ text: `  (${e.startDate} - ${e.current ? 'Present' : e.endDate})`, italics: true, size: 20, font: 'Calibri' })
            ]
          })
        );
        e.responsibilities?.forEach(bullet => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: bullet, size: 20, font: 'Calibri' })]
            })
          );
        });
      });
    }

    // 5. Education
    if (resume.education && resume.education.length > 0) {
      children.push(createSectionHeader('Education'));
      resume.education.forEach(edu => {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `${edu.degree} — ${edu.institution}`, bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: ` (${edu.endYear})`, italics: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: edu.cgpaOrPercentage ? ` | Score: ${edu.cgpaOrPercentage}` : '', size: 20, font: 'Calibri' })
            ]
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children
        }
      ]
    });

    return await Packer.toBuffer(doc);
  }
}
